import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/libs/serverAuth";
import prismadb from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { currentUser } = await serverAuth(req, res);

    if (!currentUser?.isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (req.method === "GET") {
      const movies = await prismadb.movie.findMany();
      return res.status(200).json(movies);
    }

    if (req.method === "POST") {
      const { title, description, videoUrl, thumbnailUrl, genre, duration } = req.body;

      if (!title || !description || !videoUrl || !thumbnailUrl || !genre || !duration) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // 動画をデータベースに追加
      const newMovie = await prismadb.movie.create({
        data: { title, description, videoUrl, thumbnailUrl, genre, duration },
      });

      // 通知を全ユーザーに作成
      const users = await prismadb.user.findMany();
      await Promise.all(
        users.map((user) =>
          prismadb.notification.create({
            data: {
              userId: user.id,
              title: "新着動画",
              description: `新しい動画「${title}」が追加されました！`,
              thumbnailUrl,
              movieId: newMovie.id, // 新しいMovieのIDを使用
            },
          })
        )
      );

      return res.status(201).json(newMovie);
    }

    if (req.method === "PUT") {
      const { id, title, description, videoUrl, thumbnailUrl, genre, duration } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Missing movie ID" });
      }

      const updatedMovie = await prismadb.movie.update({
        where: { id },
        data: { title, description, videoUrl, thumbnailUrl, genre, duration },
      });

      return res.status(200).json(updatedMovie);
    }

    if (req.method === "DELETE") {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Missing movie ID" });
      }

      await prismadb.movie.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Movie deleted successfully" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}