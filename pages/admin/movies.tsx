import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Navbar from "@/components/Navbar";

type Movie = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  genre: string;
  duration: string;
};

export default function AdminMovies() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [newMovie, setNewMovie] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    genre: "",
    duration: "",
  });
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  useEffect(() => {
    axios
      .get("/api/current")
      .then((response) => {
        if (response.data?.isAdmin) {
          setIsAdmin(true);
        } else {
          router.push("/");
        }
      })
      .catch(() => {
        router.push("/");
      });
  }, [router]);

  useEffect(() => {
    if (isAdmin) {
      axios
        .get("/api/admin/movie")
        .then((response) => setMovies(response.data))
        .catch((error) => console.error("Error fetching movies:", error));
    }
  }, [isAdmin]);

  const handleAddMovie = async () => {
    try {
      const response = await axios.post("/api/admin/movie", newMovie);
      setMovies((prev) => [...prev, response.data]);
      setNewMovie({
        title: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "",
        genre: "",
        duration: "",
      });
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  const handleDeleteMovie = async (id: string) => {
    try {
      await axios.delete("/api/admin/movie", { data: { id } });
      setMovies((prev) => prev.filter((movie) => movie.id !== id));
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const handleEditMovie = async () => {
    if (!editingMovie) return;

    try {
      const response = await axios.put("/api/admin/movie", editingMovie);
      setMovies((prev) =>
        prev.map((movie) =>
          movie.id === editingMovie.id ? response.data : movie
        )
      );
      setEditingMovie(null);
    } catch (error) {
      console.error("Error editing movie:", error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<any>>) => {
    const { name, value } = e.target;
    setter((prev: any) => ({ ...prev, [name]: value }));
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-red-600">動画管理画面</h1>

        <div className="bg-zinc-900 border-none mb-8 p-6 rounded-lg">
          {editingMovie ? (
            <form onSubmit={(e: FormEvent<HTMLFormElement>) => { e.preventDefault(); handleEditMovie(); }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  className="bg-zinc-800 border-none text-white p-2 rounded"
                  placeholder="タイトル"
                  name="title"
                  value={editingMovie.title}
                  onChange={(e) => handleInputChange(e, setEditingMovie)}
                />
                <input
                  className="bg-zinc-800 border-none text-white p-2 rounded"
                  placeholder="詳細-説明欄"
                  name="description"
                  value={editingMovie.description}
                  onChange={(e) => handleInputChange(e, setEditingMovie)}
                />
                <input
                  className="bg-zinc-800 border-none text-white p-2 rounded"
                  placeholder="動画URL"
                  name="videoUrl"
                  value={editingMovie.videoUrl}
                  onChange={(e) => handleInputChange(e, setEditingMovie)}
                />
                <input
                  className="bg-zinc-800 border-none text-white p-2 rounded"
                  placeholder="サムネイルURL"
                  name="thumbnailUrl"
                  value={editingMovie.thumbnailUrl}
                  onChange={(e) => handleInputChange(e, setEditingMovie)}
                />
                <input
                  className="bg-zinc-800 border-none text-white p-2 rounded"
                  placeholder="ジャンル"
                  name="genre"
                  value={editingMovie.genre}
                  onChange={(e) => handleInputChange(e, setEditingMovie)}
                />
                <input
                  className="bg-zinc-800 border-none text-white p-2 rounded"
                  placeholder="動画時間"
                  name="duration"
                  value={editingMovie.duration}
                  onChange={(e) => handleInputChange(e, setEditingMovie)}
                />
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
                  修正を保存
                </button>
                <button onClick={() => setEditingMovie(null)} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">
                  キャンセル
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={(e: FormEvent<HTMLFormElement>) => { e.preventDefault(); handleAddMovie(); }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  className="bg-zinc-800 border-none text-white p-2 rounded"
                  placeholder="タイトル"
                  name="title"
                  value={newMovie.title}
                  onChange={(e) => handleInputChange(e, setNewMovie)}
                />
                <input
                  className="bg-zinc-800 border-none text-white p-2 rounded"
                  placeholder="詳細-説明欄"
                  name="description"
                  value={newMovie.description}
                  onChange={(e) => handleInputChange(e, setNewMovie)}
                />
                <input
                  className="bg-zinc-800 border-none text-white p-2 rounded"
                  placeholder="動画URL"
                  name="videoUrl"
                  value={newMovie.videoUrl}
                  onChange={(e) => handleInputChange(e, setNewMovie)}
                />
                <input
                  className="bg-zinc-800 border-none text-white p-2 rounded"
                  placeholder="サムネイルURL"
                  name="thumbnailUrl"
                  value={newMovie.thumbnailUrl}
                  onChange={(e) => handleInputChange(e, setNewMovie)}
                />
                <input
                  className="bg-zinc-800 border-none text-white p-2 rounded"
                  placeholder="ジャンル"
                  name="genre"
                  value={newMovie.genre}
                  onChange={(e) => handleInputChange(e, setNewMovie)}
                />
                <input
                  className="bg-zinc-800 border-none text-white p-2 rounded"
                  placeholder="動画時間"
                  name="duration"
                  value={newMovie.duration}
                  onChange={(e) => handleInputChange(e, setNewMovie)}
                />
              </div>
              <button type="submit" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
                動画を追加する
              </button>
            </form>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-zinc-900 border-none overflow-hidden rounded-lg flex flex-col">
            <img
              src={movie.thumbnailUrl}
              alt={movie.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{movie.genre} • {movie.duration}</p>
              <div className="mt-auto flex justify-between">
                <button
                  onClick={() => setEditingMovie(movie)}
                  className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-xs"
                >
                  編集
                </button>
                <button
                  onClick={() => handleDeleteMovie(movie.id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
          ))}
        </div>
      </div>
    </div>
  );
}

