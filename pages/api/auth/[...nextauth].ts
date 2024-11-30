import NextAuth, { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { compare } from 'bcrypt';
import prismadb from '@/libs/prismadb';

// 認証オプションをエクスポート
export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password', // 修正: 'passord' を 'password' に変更
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const user = await prismadb.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.hashedPassword) {
          throw new Error('Invalid credentials');
        }

        const isCorrectPassword = await compare(credentials.password, user.hashedPassword);

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: '/auth', // サインインページを指定
  },
  debug: process.env.NODE_ENV === 'development',
  adapter: PrismaAdapter(prismadb), // Prismaアダプターを設定
  session: {
    strategy: 'jwt', // JWTをセッション戦略として使用
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET, // JWTの秘密鍵
  },
  secret: process.env.NEXTAUTH_SECRET, // NextAuthの秘密鍵
};

// デフォルトエクスポートで NextAuth を初期化
export default NextAuth(authOptions);
