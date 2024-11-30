import React from 'react';
import styles from '@/styles/Intro.module.sass'; // SASSファイルのインポート

// `FurBrush` コンポーネント: 31個の `fur-` スパンを生成
const FurBrush: React.FC = () => {
  const furs = Array.from({ length: 31 }, (_, i) => (
    <span key={i} className={styles[`fur-${31 - i}`]}></span>
  ));
  return <div className={styles['effect-brush']}>{furs}</div>;
};

// `LampLights` コンポーネント: 28個の `lamp-` スパンを生成
const LampLights: React.FC = () => {
  const lamps = Array.from({ length: 28 }, (_, i) => (
    <span key={i} className={styles[`lamp-${i + 1}`]}></span>
  ));
  return <div className={styles['effect-lumieres']}>{lamps}</div>;
};

// `NetflixIntroProps` インターフェース: `letter` プロパティを定義
interface NetflixIntroProps {
  letter: 'N' | 'E' | 'T' | 'F' | 'L' | 'I' | 'X';
}

// `NetflixIntro` コンポーネント: 各 `helper` セクションをレンダリング
const NetflixIntro: React.FC<NetflixIntroProps> = ({ letter }) => {
  return (
    <div className={styles.netflixintro} data-letter={letter}>
      <div className={styles['helper-1']}>
        <FurBrush />
        <LampLights />
      </div>
      <div className={styles['helper-2']}>
        <FurBrush />
      </div>
      <div className={styles['helper-3']}>
        <FurBrush />
      </div>
      <div className={styles['helper-4']}>
        <FurBrush />
      </div>
    </div>
  );
};

// `Intro` コンポーネント: メインコンテナとして `NetflixIntro` を使用
const Intro: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* `letter` プロパティを "N", "E", "T", "F", "L", "I", "X" のいずれかに変更 */}
      <NetflixIntro letter="X" />
    </div>
  );
};

export default Intro;