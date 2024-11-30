import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/libs/prismadb';
import serverAuth from '@/libs/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    await serverAuth(req, res);

    const { genre } = req.query;

    if (!genre || typeof genre !== 'string') {
      return res.status(400).json({ error: 'Genre query parameter is required' });
    }

    const movies = await prismadb.movie.findMany({
      where: {
        genre,
      },
    });

    return res.status(200).json(movies);
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
