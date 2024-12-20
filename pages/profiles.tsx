import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useState, useEffect } from "react";

import useCurrentUser from "@/hooks/useCurrentUser";
import Intro from "@/components/Intro"; // Introコンポーネントをインポート

const images = [
  '/images/default-blue.png',
  '/images/default-red.png',
  '/images/default-slate.png',
  '/images/default-green.png'
];

interface UserCardProps {
  name: string;
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

const UserCard: React.FC<UserCardProps> = ({ name }) => {
  const imgSrc = images[Math.floor(Math.random() * 4)];

  return (
    <div className="group flex-row w-44 mx-auto">
      <div className="w-44 h-44 rounded-md flex items-center justify-center border-2 border-transparent group-hover:cursor-pointer group-hover:border-white overflow-hidden">
        <img draggable={false} className="w-max h-max object-contain" src={imgSrc} alt="" />
      </div>
      <div className="mt-4 text-gray-400 text-2xl text-center group-hover:text-white">{name}</div>
    </div>
  );
}

const App = () => {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const [showIntro, setShowIntro] = useState(true);

  const selectProfile = useCallback(() => {
    router.push('/');
  }, [router]);

  useEffect(() => {
    // Introを3秒間表示
    const timer = setTimeout(() => setShowIntro(false), 6100);
    return () => clearTimeout(timer);
  }, []);

  // Introを表示している間はIntroのみをレンダリング
  if (showIntro) {
    return <Intro />;
  }

  return (
    <div className="flex items-center h-full justify-center">
      <div className="flex flex-col">
        <h1 className="text-3xl md:text-6xl text-white text-center">どなたが観ますか？</h1>
        <div className="flex items-center justify-center gap-8 mt-10">
          <div onClick={() => selectProfile()}>
            <UserCard name={currentUser?.name} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;