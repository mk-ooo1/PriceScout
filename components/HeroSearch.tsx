"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mt-8">
      <div className="relative flex items-center w-full h-14 rounded-full focus-within:shadow-lg bg-white overflow-hidden shadow-md">
        <div className="grid place-items-center h-full w-12 text-gray-400">
          <Search className="h-6 w-6" />
        </div>

        <input
          className="peer h-full w-full outline-none text-gray-700 pr-4 bg-transparent font-medium text-lg"
          type="text"
          id="search"
          placeholder="Search for products, brands..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          type="submit"
          className="h-full px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm uppercase tracking-wide transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
