import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { useRouter } from "next/router";

import AccountMenu from "@/components/AccountMenu";
import MobileMenu from "@/components/MobileMenu";
import NotificationBell from "@/components/NotificationBell";

const TOP_OFFSET = 66;

// SearchBar Styles
const Search = styled("div")(() => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  border: "1px solid transparent",
  backgroundColor: "transparent",
  height: "40px",
  "&.active": {
    border: "1px solid white",
    backgroundColor: "black",
  },
}));

const SearchIconWrapper = styled("div")(() => ({
  cursor: "pointer",
  padding: "0 8px",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(() => ({
  color: "white",
  width: 0,
  overflow: "hidden",
  transition: "none", // アニメーションを削除
  "&.active": {
    width: "200px", // 幅を即座に設定
  },
}));

const Navbar = () => {
  const router = useRouter();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const toggleAccountMenu = useCallback(() => {
    setShowAccountMenu((current) => !current);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setShowMobileMenu((current) => !current);
  }, []);

  const navigateToHome = useCallback(() => {
    router.push("/");
  }, [router]);

  const navigateToMylist = useCallback(() => {
    router.push("/mylist");
  }, [router]);

  const handleSearchToggle = () => {
    setIsSearchVisible((current) => !current);
    if (!isSearchVisible) {
      searchInputRef.current?.focus();
    }
  };

  const handleSearchSubmit = () => {
    if (searchKeyword.trim()) {
      router.push(`/search?keyword=${encodeURIComponent(searchKeyword)}`);
      setIsSearchVisible(false);
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !isComposing) {
      handleSearchSubmit();
    }
  };

  const handleInputCompositionStart = () => {
    setIsComposing(true);
  };

  const handleInputCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target as Node)
    ) {
      setIsSearchVisible(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackground(window.scrollY >= TOP_OFFSET);
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full fixed z-40">
      <div
        className={`px-4 md:px-16 py-6 flex flex-row items-center transition duration-500 ${
          showBackground ? "bg-zinc-900 bg-opacity-90" : ""
        }`}
      >
        <img
          src="https://raw.githubusercontent.com/zenon7171/RENFLIX/refs/heads/main/public/images/logo.png"
          className="h-4 lg:h-7 cursor-pointer"
          alt="Logo"
          onClick={navigateToHome}
        />
        <div className="flex-row ml-8 gap-7 hidden lg:flex">
          <div
            onClick={navigateToHome}
            className="text-white cursor-pointer hover:text-gray-300 transition"
          >
            ホーム
          </div>
          <div className="text-white cursor-pointer hover:text-gray-300 transition">
            シリーズ
          </div>
          <div className="text-white cursor-pointer hover:text-gray-300 transition">
            映画
          </div>
          <div className="text-white cursor-pointer hover:text-gray-300 transition">
            新着 & 人気
          </div>
          <div
            onClick={navigateToMylist}
            className="text-white cursor-pointer hover:text-gray-300 transition"
          >
            マイリスト
          </div>
        </div>
        <div
          onClick={toggleMobileMenu}
          className="lg:hidden flex flex-row items-center gap-2 ml-8 cursor-pointer relative"
        >
          <p className="text-white text-sm">Browse</p>
          <ChevronDownIcon
            className={`w-4 text-white fill-white transition ${
              showMobileMenu ? "rotate-180" : "rotate-0"
            }`}
          />
          <MobileMenu visible={showMobileMenu} />
        </div>
        <div className="flex flex-row ml-auto gap-7 items-center">
          {/* Search Box */}
          <Search className={isSearchVisible ? "active" : ""}>
            <SearchIconWrapper onClick={handleSearchToggle}>
              <MagnifyingGlassIcon className="w-6 text-white" />
            </SearchIconWrapper>
            <StyledInputBase
              className={isSearchVisible ? "active" : ""}
              inputRef={searchInputRef}
              placeholder="Titles, people, genres"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onCompositionStart={handleInputCompositionStart}
              onCompositionEnd={handleInputCompositionEnd}
              inputProps={{
                "aria-label": "search",
              }}
            />
          </Search>
          <NotificationBell />
          <div
            onClick={toggleAccountMenu}
            className="flex flex-row items-center gap-2 cursor-pointer relative"
          >
            <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-md overflow-hidden">
              <img src="/images/default-blue.png" alt="" />
            </div>
            <ChevronDownIcon
              className={`w-4 text-white fill-white transition ${
                showAccountMenu ? "rotate-180" : "rotate-0"
              }`}
            />
            <AccountMenu visible={showAccountMenu} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
