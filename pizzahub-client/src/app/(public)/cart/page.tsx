
"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
  } = useCart();

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <main className="container mx-auto flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-5 rounded-full bg-orange-100 p-6 text-orange-600">
          <ShoppingBag className="h-12 w-12" />
        </div>

        <h1 className="text-3xl font-bold">
          Your Cart is Empty
        </h1>

        <p className="mt-2 text-muted-foreground">
          Looks like you haven&apos;t added any delicious pizza yet.
        </p>

        <Link
          href="/menu"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-orange-600 px-5 text-sm font-medium text-white transition hover:bg-orange-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Explore Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Shopping Cart
          </h1>

          <p className="mt-1 text-muted-foreground">
            Review your delicious selections.
          </p>
        </div>

        <Button variant="outline" onClick={clearCart}>
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Cart
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        <section className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center"
            >
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-orange-50 text-4xl">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "🍕"
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-semibold">
                  {item.name}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  ৳{item.price.toFixed(2)} each
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    disabled={item.quantity <= 1}
                    onClick={() =>
                      updateQuantity(item._id, item.quantity - 1)
                    }
                    aria-label={`Decrease ${item.name} quantity`}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="min-w-5 text-center font-semibold">
                    {item.quantity}
                  </span>

                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() =>
                      updateQuantity(item._id, item.quantity + 1)
                    }
                    aria-label={`Increase ${item.name} quantity`}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                <p className="font-bold">
                  ৳{(item.price * item.quantity).toFixed(2)}
                </p>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => removeFromCart(item._id)}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </section>

        <aside className="h-fit rounded-xl border p-6">
          <h2 className="text-xl font-bold">
            Order Summary
          </h2>

          <div className="mt-5 flex justify-between text-sm">
            <span className="text-muted-foreground">
              Subtotal ({totalItems} items)
            </span>

            <span>
              ৳{cartSubtotal.toFixed(2)}
            </span>
          </div>

          <div className="mt-4 flex justify-between text-sm">
            <span className="text-muted-foreground">
              Delivery Fee
            </span>

            <span>Calculated at checkout</span>
          </div>

          <Separator className="my-5" />

          <div className="flex justify-between text-lg font-bold">
            <span>Subtotal</span>

            <span className="text-orange-600">
              ৳{cartSubtotal.toFixed(2)}
            </span>
          </div>

          <Button
            className="mt-6 w-full bg-orange-600 hover:bg-orange-700"
            disabled
          >
            Proceed to Checkout
          </Button>

          <Link
            href="/menu"
            className="mt-3 flex h-10 w-full items-center justify-center rounded-md border text-sm font-medium transition hover:bg-accent"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}
