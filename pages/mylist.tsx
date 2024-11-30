import React, { useEffect, useState } from 'react';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';

import Navbar from '@/components/Navbar';

import MovieList from '@/components/MovieList';
import InfoModal from '@/components/InfoModal';
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
  const { data: favorites = [] } = useFavorites();
  const { isOpen, closeModal } = useInfoModalStore();


  return (
    <>
      <InfoModal visible={isOpen} onClose={closeModal} />
      <Navbar />
      <div className="px-4 md:px-12 py-16"> {/* 余白を調整 */}
        <h1 className="text-white text-3xl font-bold mb-6 mt-8 ml-4">マイリスト</h1>
      <MovieList title="" data={favorites} useSlider={false} />
      </div>
    </>
  );
};

export default Home;