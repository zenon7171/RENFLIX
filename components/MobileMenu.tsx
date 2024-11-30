import React from 'react';

interface MobileMenuProps {
  visible?: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ visible }) => {
  if (!visible) {
    return null;
  }

  return (
    <div className="bg-black w-56 absolute top-8 left-0 py-5 flex-col border-2 border-gray-800 flex">
      <div className="flex flex-col gap-4">
        <div className="px-3 text-center text-white hover:underline">
          ホーム
        </div>
        <div className="px-3 text-center text-white hover:underline">
          シリーズ
        </div>
        <div className="px-3 text-center text-white hover:underline">
          映画
        </div>
        <div className="px-3 text-center text-white hover:underline">
          新着 & 人気
        </div>
        <div className="px-3 text-center text-white hover:underline">
          マイリスト
        </div>
      </div>
    </div>
  )
}

export default MobileMenu;
