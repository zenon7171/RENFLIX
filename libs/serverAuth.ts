import { User } from "@prisma/client"; // Prisma の User 型をインポート
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prismadb from "@/libs/prismadb";

const serverAuth = async (req: NextApiRequest, res: NextApiResponse): Promise<{ currentUser: User }> => {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    console.error("Unauthorized access attempt");
    throw new Error("Not signed in");
  }

  const currentUser = await prismadb.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!currentUser) {
    console.error("User not found");
    throw new Error("Not signed in");
  }

  return { currentUser }; // Prisma 型がそのまま利用される
};

export default serverAuth;
