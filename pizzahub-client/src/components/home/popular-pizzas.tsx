
"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Flame, Leaf } from "lucide-react";
import Link from "next/link";
import { usePublicMenu } from "@/hooks/use-menu";

export default function PopularPizzas() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = usePublicMenu({
    page: 1,
    limit: 4,
    sort: "newest",
  });

  const pizzas = data?.data ?? [];

  return (
    <section
      id="popular"
      className="bg-[#FFF9F2] px-5 py-20 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#D9362B]">
            Customer Favorites
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-[#242424] md:text-4xl">
            Popular <span className="text-[#D9362B]">Pizzas</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-600">
            Discover our delicious pizzas, freshly prepared
            with quality ingredients.
          </p>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="h-52 bg-orange-100" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 rounded bg-orange-100" />
                  <div className="h-4 w-full rounded bg-orange-50" />
                  <div className="h-6 w-1/2 rounded bg-orange-100" />
                  <div className="h-11 rounded-full bg-orange-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <p className="font-semibold text-red-600">
              Failed to load pizzas.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {error instanceof Error
                ? error.message
                : "Something went wrong."}
            </p>

            <button
              onClick={() => refetch()}
              className="mt-5 rounded-full bg-[#D9362B] px-6 py-3 font-bold text-white hover:bg-[#b92b23]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && pizzas.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center">
            <div className="text-5xl">🍕</div>
            <h3 className="mt-4 text-xl font-bold text-[#242424]">
              No Pizzas Available Yet
            </h3>
            <p className="mt-2 text-gray-500">
              Our delicious pizzas will be available soon!
            </p>
          </div>
        )}

        {/* Pizza Cards */}
        {!isLoading && !isError && pizzas.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
            className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4"
          >
            {pizzas.map((pizza) => (
              <motion.article
                key={pizza._id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition-shadow hover:shadow-xl"
              >
                {/* Pizza Image */}
                <div className="relative h-52 overflow-hidden bg-orange-100">
                  {pizza.imageUrl ? (
                    <img
                      src={pizza.imageUrl}
                      alt={pizza.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-7xl">
                      🍕
                    </div>
                  )}

                  {pizza.isFeatured && (
                    <span className="absolute left-3 top-3 rounded-full bg-[#D9362B] px-3 py-1 text-xs font-bold text-white">
                      Featured
                    </span>
                  )}

                  {pizza.isVegetarian && (
                    <span className="absolute right-3 top-3 rounded-full bg-white p-2 text-green-700 shadow">
                      <Leaf size={17} />
                    </span>
                  )}
                </div>

                {/* Pizza Details */}
                <div className="p-5">
                  <span className="text-xs font-bold uppercase tracking-wide text-[#F28C28]">
                    {pizza.category}
                  </span>

                  <h3 className="mt-2 text-lg font-extrabold text-[#242424]">
                    {pizza.name}
                  </h3>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">
                    {pizza.description}
                  </p>

                  {pizza.isSpicy && (
                    <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-red-600">
                      <Flame size={15} />
                      Spicy
                    </div>
                  )}

                  {/* Price */}
                  <div className="mt-4">
                    <span className="text-xl font-extrabold text-[#D9362B]">
                      ৳{pizza.price}
                    </span>
                  </div>

                  {/* Order Button */}
                  <Link
                    href="/menu"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#D9362B] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#b92b23] active:scale-95"
                  >
                    <ShoppingCart size={17} />
                    Order Now
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* View Full Menu */}
        <div className="mt-12 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-full border-2 border-[#D9362B] px-8 py-3 font-bold text-[#D9362B] transition hover:bg-[#D9362B] hover:text-white"
          >
            View Full Menu →
          </Link>
        </div>
      </div>
    </section>
  );
}
