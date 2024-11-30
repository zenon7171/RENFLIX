import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    // 認証確認
    await serverAuth(req, res);

    // 映画の総数を取得
    const moviesCount = await prismadb.movie.count();
    const randomIndex = Math.floor(Math.random() * moviesCount);

    // ランダムな映画を取得
    const randomMovies = await prismadb.movie.findMany({
      take: 1,
      skip: randomIndex
    });

    return res.status(200).json(randomMovies[0]);
  } catch (error) {
    console.log('Error in /api/random:', error);
    return res.status(500).end();
  }
}
