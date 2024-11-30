import React, { useState, useEffect, useRef } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import useInfoModalStore from "@/hooks/useInfoModalStore";

interface Notification {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  movieId: string;
  createdAt: string;
  isRead: boolean;
}

const NotificationBell: React.FC = () => {
  const { openModal } = useInfoModalStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 通知を取得
  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch notifications");
        }
        return res.json();
      })
      .then((data) => {
        const notifications = data.notifications || []; // 安全なデフォルト値
        setNotifications(notifications);
        setHasNewNotifications(
          notifications.some((notification: Notification) => !notification.isRead)
        );
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
        setNotifications([]); // エラー時も空配列を設定
      });
  }, []);

  // ベルアイコンのクリックでドロップダウンを開閉
  const handleBellClick = () => {
    setIsDropdownOpen((prev) => !prev);
    if (hasNewNotifications) {
      fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).then(() => setHasNewNotifications(false));
    }
  };

  // 通知アイテムをクリックしたらモーダルを開く
  const handleNotificationClick = (movieId: string) => {
    console.log("Notification clicked, movieId:", movieId); // デバッグログ
    if (movieId) {
      openModal(movieId);
      setIsDropdownOpen(false); // ドロップダウンを閉じる
    }
  };

  // ドロップダウン外をクリックした場合に閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <div className="relative">
      <button
        onClick={handleBellClick}
        className="relative p-2 text-white focus:outline-none"
        aria-label="通知"
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
      >
        <BellIcon className="w-6 h-6" />
        {hasNewNotifications && (
          <span className="absolute top-0 right-0 block w-2 h-2 bg-red-600 rounded-full" />
        )}
      </button>
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-80 bg-black border border-gray-700 rounded-md shadow-lg z-50 overflow-hidden"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="notification-menu"
        >
          <div className="py-2 px-4 bg-gray-900 text-white text-sm font-semibold">
            通知
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.movieId)}
                  className="flex items-start p-4 hover:bg-gray-900 transition-colors duration-200 cursor-pointer"
                  role="menuitem"
                >
                  <img
                    src={notification.thumbnailUrl}
                    alt=""
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {notification.title}
                    </p>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                      {notification.description}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <li className="py-4 px-4 text-center text-gray-400" role="menuitem">
                新しい通知はありません。
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;