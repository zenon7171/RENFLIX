import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { currentUser } = await serverAuth(req, res); // 認証

    if (req.method === "GET") {
      // 未読通知を取得
      const notifications = await prismadb.notification.findMany({
        where: {
          userId: currentUser.id,
          isRead: false,
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({ notifications });
    }

    if (req.method === "POST") {
      // 通知を既読にマーク
      await prismadb.notification.updateMany({
        where: {
          userId: currentUser.id,
          isRead: false,
        },
        data: { isRead: true },
      });

      return res.status(200).json({ success: true });
    }

    // サポートされていないメソッドの場合
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("Error in notifications API:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}