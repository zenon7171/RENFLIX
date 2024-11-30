import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';

import Navbar from '@/components/Navbar';
import Billboard from '@/components/Billboard';
import MovieList from '@/components/MovieList';
import InfoModal from '@/components/InfoModal';
import useMovieList from '@/hooks/useMovieList';
import useFavorites from '@/hooks/useFavorites';
import useInfoModalStore from '@/hooks/useInfoModalStore';

export interface MovieInterface {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  genre: string;
  duration: string;
  createdAt: string; // ISO形式の文字列
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      }
    };
  }

  return {
    props: {},
  };
}

const Home = () => {
  const { data: rawMovies = [] } = useMovieList(); // ソート前の生データ
  const { data: favorites = [] } = useFavorites();
  const { isOpen, closeModal } = useInfoModalStore();

  // ステートに型を指定
  const [movies, setMovies] = useState<MovieInterface[]>([]);
  const [genreMovies, setGenreMovies] = useState<MovieInterface[]>([]);
  const [spaceMovies, setSpaceMovies] = useState<MovieInterface[]>([]);
  const [arfaMovies, setArfaMovies] = useState<MovieInterface[]>([]);
  const [dcMovies, setdcMovies] = useState<MovieInterface[]>([]);
  useEffect(() => {
    // 新着映画を日付順にソート
    const sortMoviesByDate = () => {
      const sortedMovies = [...rawMovies].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime(); // 新しい順
      });
      setMovies(sortedMovies);
    };

    sortMoviesByDate();

    // 「企画」の映画を取得
    const fetchGenreMovies = async () => {
      try {
        const response = await axios.get('/api/movies/genre?genre=企画');
        setGenreMovies(response.data);
      } catch (error) {
        console.error('Error fetching genre movies:', error);
      }
    };

    // 「スペース」の映画を取得
    const fetchSpaceMovies = async () => {
      try {
        const response = await axios.get('/api/movies/genre?genre=スペース');
        setSpaceMovies(response.data);
      } catch (error) {
        console.error('Error fetching space movies:', error);
      }
    };

    // 「ARFA」の映画を取得
    const fetchArfaMovies = async () => {
      try {
        const response = await axios.get('/api/movies/genre?genre=ARFA');
        setArfaMovies(response.data);
      } catch (error) {
        console.error('Error fetching ARFA movies:', error);
      }
    };

    const fetchdcMovies = async () => {
      try {
        const response = await axios.get('/api/movies/genre?genre=Direction-Complete');
        setdcMovies(response.data);
      } catch (error) {
        console.error('Error fetching Direction-Complete movies:', error);
      }
    };

    fetchGenreMovies();
    fetchSpaceMovies();
    fetchArfaMovies();
    fetchdcMovies();
  }, [rawMovies]);

  return (
    <>
      <InfoModal visible={isOpen} onClose={closeModal} />
      <Navbar />
      <Billboard />
      <div className="pb-40">
      <MovieList title="新着" data={movies} useSlider={true} />
      <MovieList title="ARFA" data={arfaMovies} useSlider={true} />
      <MovieList title="スペース" data={spaceMovies} useSlider={true} />
      <MovieList title="Direction-Complete" data={dcMovies} useSlider={true} />
      <MovieList title="企画" data={genreMovies} useSlider={true} />
      <MovieList title="お気に入り" data={favorites} useSlider={true} />
      </div>
    </>
  );
};

export default Home;