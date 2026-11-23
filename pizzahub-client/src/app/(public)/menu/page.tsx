
"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Leaf, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { usePublicMenu } from "@/hooks/use-menu";

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<
    "newest" | "price_asc" | "price_desc"
  >("newest");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = usePublicMenu({
    search: search.trim() || undefined,
    category: category || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort,
    page,
    limit: 8,
  });

  const pizzas = data?.data ?? [];
  const pagination = data?.pagination;

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2]">
      {/* Hero */}
      <section className="bg-[#242424] px-5 py-16 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
          Fresh From Our Kitchen
        </p>
        <h1 className="mt-3 text-4xl font-extrabold text-white md:text-5xl">
          Explore Our <span className="text-[#F28C28]">Menu</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-gray-300">
          Find your favorite pizza, made fresh with delicious ingredients.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        {/* Search and Sort */}
        <div className="mb-6 grid gap-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search your favorite pizza..."
              className="w-full rounded-xl border border-orange-100 bg-white py-4 pl-12 pr-4 outline-none transition focus:border-[#D9362B] focus:ring-2 focus:ring-[#D9362B]/10"
            />
          </div>

          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as typeof sort);
              setPage(1);
            }}
            className="rounded-xl border border-orange-100 bg-white px-4 py-4 outline-none focus:border-[#D9362B]"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[250px_1fr]">
          {/* Filters */}
          <aside className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-extrabold text-[#242424]">
                <SlidersHorizontal size={19} />
                Filters
              </h2>
              <button
                onClick={resetFilters}
                className="text-sm font-semibold text-[#D9362B] hover:underline"
              >
                Reset
              </button>
            </div>

            <div className="mt-6">
              <h3 className="mb-3 text-sm font-bold text-[#242424]">
                Category
              </h3>
              <select
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-orange-100 bg-white px-3 py-3 text-sm outline-none focus:border-[#D9362B]"
              >
                <option value="">All Categories</option>
                <option value="Pizza">Pizza</option>
                <option value="Burger">Burger</option>
                <option value="Pasta">Pasta</option>
                <option value="Drinks">Drinks</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>

            <div className="mt-6">
              <h3 className="mb-3 text-sm font-bold text-[#242424]">
                Price Range (৳)
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(event) => {
                    setMinPrice(event.target.value);
                    setPage(1);
                  }}
                  className="min-w-0 rounded-lg border border-orange-100 px-3 py-3 text-sm outline-none focus:border-[#D9362B]"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(event) => {
                    setMaxPrice(event.target.value);
                    setPage(1);
                  }}
                  className="min-w-0 rounded-lg border border-orange-100 px-3 py-3 text-sm outline-none focus:border-[#D9362B]"
                />
              </div>
            </div>
          </aside>

          {/* Products */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-[#242424]">
                  All Pizzas
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {pagination?.totalItems ?? 0} items found
                </p>
              </div>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-80 animate-pulse rounded-2xl bg-orange-100"
                  />
                ))}
              </div>
            )}

            {/* Error */}
            {isError && (
              <div className="rounded-2xl bg-white p-10 text-center">
                <p className="font-bold text-red-600">
                  Failed to load menu.
                </p>
                <button
                  onClick={() => refetch()}
                  className="mt-4 rounded-full bg-[#D9362B] px-6 py-3 font-bold text-white"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && pizzas.length === 0 && (
              <div className="rounded-2xl bg-white p-12 text-center">
                <div className="text-6xl">🍕</div>
                <h3 className="mt-4 text-xl font-bold text-[#242424]">
                  No Pizzas Found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Try changing your search or filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-5 rounded-full bg-[#D9362B] px-6 py-3 font-bold text-white"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pizza Cards */}
            {!isLoading && !isError && pizzas.length > 0 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.1 },
                  },
                }}
                className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
              >
                {pizzas.map((pizza) => (
                  <motion.article
                    key={pizza._id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ y: -6 }}
                    className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:shadow-xl"
                  >
                    <div className="relative h-52 overflow-hidden bg-orange-100">
                      {pizza.imageUrl ? (
                        <img
                          src={pizza.imageUrl}
                          alt={pizza.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-7xl">
                          🍕
                        </div>
                      )}

                      {pizza.isVegetarian && (
                        <span className="absolute right-3 top-3 rounded-full bg-white p-2 text-green-700 shadow">
                          <Leaf size={18} />
                        </span>
                      )}
                    </div>

                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#F28C28]">
                        {pizza.category}
                      </p>

                      <h3 className="mt-2 text-lg font-extrabold text-[#242424]">
                        {pizza.name}
                      </h3>

                      <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">
                        {pizza.description}
                      </p>

                      {pizza.isSpicy && (
                        <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-red-600">
                          <Flame size={15} /> Spicy
                        </p>
                      )}

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xl font-extrabold text-[#D9362B]">
                          ৳{pizza.price}
                        </span>

                        <Link
                          href={`/menu/${pizza._id}`}
                          className="rounded-full bg-[#D9362B] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#b92b23]"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {!isLoading &&
              !isError &&
              pagination &&
              pagination.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-4">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((current) => current - 1)}
                    className="flex items-center gap-1 rounded-full border border-orange-200 px-5 py-3 text-sm font-bold text-[#242424] transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>

                  <span className="text-sm font-bold text-[#242424]">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>

                  <button
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((current) => current + 1)}
                    className="flex items-center gap-1 rounded-full border border-orange-200 px-5 py-3 text-sm font-bold text-[#242424] transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
          </div>
        </div>
      </section>
    </div>
  );
}
