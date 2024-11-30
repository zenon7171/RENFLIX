import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/libs/prismadb';
import serverAuth from '@/libs/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    await serverAuth(req, res);

    const { keyword } = req.query;

    if (!keyword || typeof keyword !== 'string' || keyword.trim() === '') {
      return res.status(400).json({ error: 'Valid keyword query parameter is required' });
    }

    const movies = await prismadb.movie.findMany({
      where: {
        OR: [
          {
            title: {
              contains: keyword.trim(),
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: keyword.trim(),
              mode: 'insensitive',
            },
          },
          {
            genre: {
              contains: keyword.trim(),
              mode: 'insensitive',
            },
          },
          {
            duration: {
              contains: keyword.trim(),
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    return res.status(200).json(movies);
  } catch (error) {
    console.error('Error searching movies:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}