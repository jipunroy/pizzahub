
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ShoppingCart,
  Leaf,
  Flame,
  Minus,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { getPublicMenuItemById } from "@/services/menu.service";
import { useCart } from "@/context/cart-context";

export default function PizzaDetailsPage() {
  const params = useParams<{ id: string }>();
  const pizzaId = params.id;

  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  const {
    data: pizza,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["public-menu-item", pizzaId],
    queryFn: () => getPublicMenuItemById(pizzaId),
    enabled: Boolean(pizzaId),
    staleTime: 60 * 1000,
    retry: 1,
  });

  const increaseQuantity = () => {
    setQuantity((current) => Math.min(current + 1, 10));
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(current - 1, 1));
  };

  const handleAddToCart = () => {
    if (!pizza) return;

    addToCart(pizza, quantity);

    toast.success(`${pizza.name} added to cart!`, {
      description: `${quantity} item(s) added successfully.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#FFF9F2]">
        <div className="text-center">
          <Loader2
            className="mx-auto animate-spin text-[#D9362B]"
            size={42}
          />
          <p className="mt-4 font-semibold text-gray-600">
            Loading delicious pizza...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !pizza) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#FFF9F2] px-5">
        <div className="max-w-md rounded-2xl bg-white p-10 text-center shadow-sm">
          <AlertCircle className="mx-auto text-red-500" size={48} />

          <h2 className="mt-4 text-2xl font-extrabold text-[#242424]">
            Pizza Not Found
          </h2>

          <p className="mt-2 text-gray-500">
            This pizza may be unavailable or no longer exists.
          </p>

          <button
            onClick={() => refetch()}
            className="mt-6 rounded-full bg-[#D9362B] px-6 py-3 font-bold text-white hover:bg-[#b92b23]"
          >
            Try Again
          </button>

          <Link
            href="/menu"
            className="mt-4 block font-semibold text-[#D9362B] hover:underline"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F2] px-5 py-10 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/menu"
          className="mb-8 inline-flex items-center gap-2 font-semibold text-gray-600 transition hover:text-[#D9362B]"
        >
          <ArrowLeft size={19} />
          Back to Menu
        </Link>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Pizza Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-orange-100 shadow-lg"
          >
            <div className="aspect-square">
              {pizza.imageUrl ? (
                <img
                  src={pizza.imageUrl}
                  alt={pizza.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-9xl">
                  🍕
                </div>
              )}
            </div>

            {pizza.isVegetarian && (
              <span className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-green-700 shadow">
                <Leaf size={17} />
                Vegetarian
              </span>
            )}

            {pizza.isSpicy && (
              <span className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-red-600 shadow">
                <Flame size={17} />
                Spicy
              </span>
            )}
          </motion.div>

          {/* Pizza Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              {pizza.category}
            </p>

            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-[#242424] md:text-5xl">
              {pizza.name}
            </h1>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              {pizza.description}
            </p>

            <div className="mt-8">
              <span className="text-4xl font-extrabold text-[#D9362B]">
                ৳{pizza.price}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                / item
              </span>
            </div>

            {/* Ingredients */}
            {pizza.ingredients && pizza.ingredients.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-extrabold text-[#242424]">
                  Ingredients
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {pizza.ingredients.map((ingredient, index) => (
                    <span
                      key={`${ingredient}-${index}`}
                      className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-gray-700"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-8">
              <h2 className="mb-3 font-bold text-[#242424]">
                Quantity
              </h2>

              <div className="flex w-fit items-center gap-5 rounded-full border border-orange-200 bg-white p-2">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="rounded-full p-2 transition hover:bg-orange-100 disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus size={18} />
                </button>

                <span className="min-w-6 text-center text-lg font-bold">
                  {quantity}
                </span>

                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= 10}
                  className="rounded-full p-2 transition hover:bg-orange-100 disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-5">
              <span className="font-semibold text-gray-600">
                Total Price
              </span>

              <span className="text-2xl font-extrabold text-[#D9362B]">
                ৳{(pizza.price * quantity).toFixed(2)}
              </span>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-[#D9362B] px-8 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#b92b23] hover:shadow-xl"
            >
              <ShoppingCart size={21} />
              Add to Cart
            </button>

            <p className="mt-4 text-center text-sm text-gray-500">
              Freshly prepared with quality ingredients.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
