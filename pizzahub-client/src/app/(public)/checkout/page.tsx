
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useCart } from "@/context/cart-context";
import { createCustomerOrder } from "@/services/order.service";
import type { CreatedOrder } from "@/services/order.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutPage() {
  const router = useRouter();

  const { cartItems, cartSubtotal, clearCart } = useCart();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [placedOrder, setPlacedOrder] = useState<CreatedOrder | null>(null);

  const orderMutation = useMutation({
    mutationFn: createCustomerOrder,

    onSuccess: (order) => {
      clearCart();
      setPlacedOrder(order);
      toast.success("Your order has been placed successfully!");
    },

    onError: (error: unknown) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to place order."
        : "Something went wrong.";

      toast.error(message);
    },
  });

  const getMinDateTime = () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 30);

    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);

    return localDate.toISOString().slice(0, 16);
  };

  const handlePlaceOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (deliveryAddress.trim().length < 10) {
      toast.error("Please enter a valid delivery address.");
      return;
    }

    if (!deliveryDate || new Date(deliveryDate).getTime() <= Date.now()) {
      toast.error("Please select a future delivery date and time.");
      return;
    }

    orderMutation.mutate({
      items: cartItems.map((item) => ({
        menuItemId: item._id,
        quantity: item.quantity,
      })),
      deliveryAddress: deliveryAddress.trim(),
      deliveryDate: new Date(deliveryDate).toISOString(),
    });
  };

  if (placedOrder) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
          ✓
        </div>

        <h1 className="text-3xl font-bold text-green-700">
          Order Placed Successfully!
        </h1>

        <p className="mt-3 text-muted-foreground">
          Thank you for ordering from PizzaHub.
        </p>

        <div className="mt-8 w-full rounded-xl border p-6 text-left">
          <p className="text-sm text-muted-foreground">Order ID</p>
          <p className="mt-1 break-all font-semibold">{placedOrder._id}</p>

          <div className="my-4 border-t" />

          <div className="flex justify-between">
            <span>Total Amount</span>
            <span className="font-bold">
              ৳{placedOrder.totalAmount}
            </span>
          </div>

          <div className="mt-3 flex justify-between">
            <span>Order Status</span>
            <span className="font-semibold capitalize text-orange-600">
              {placedOrder.status}
            </span>
          </div>
        </div>

        <Button
          className="mt-8"
          onClick={() => router.push("/menu")}
        >
          Continue Shopping
        </Button>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
        <p className="mt-3 text-muted-foreground">
          Add some delicious pizzas before checkout.
        </p>

        <Button className="mt-6" onClick={() => router.push("/menu")}>
          Browse Menu
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="mt-2 text-muted-foreground">
          Complete your delivery information to place your order.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <form
          onSubmit={handlePlaceOrder}
          className="space-y-6 lg:col-span-2"
        >
          <section className="rounded-xl border p-6">
            <h2 className="mb-5 text-xl font-semibold">
              Delivery Information
            </h2>

            <div className="space-y-2">
              <Label htmlFor="deliveryAddress">
                Delivery Address
              </Label>

              <textarea
                id="deliveryAddress"
                value={deliveryAddress}
                onChange={(event) => setDeliveryAddress(event.target.value)}
                placeholder="Enter your full delivery address..."
                required
                minLength={10}
                maxLength={500}
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="mt-5 space-y-2">
              <Label htmlFor="deliveryDate">
                Delivery Date & Time
              </Label>

              <Input
                id="deliveryDate"
                type="datetime-local"
                min={getMinDateTime()}
                value={deliveryDate}
                onChange={(event) => setDeliveryDate(event.target.value)}
                required
              />

              <p className="text-xs text-muted-foreground">
                Select a future delivery date and time.
              </p>
            </div>
          </section>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={orderMutation.isPending}
          >
            {orderMutation.isPending
              ? "Placing Order..."
              : `Place Order · ৳${cartSubtotal}`}
          </Button>
        </form>

        <aside className="h-fit rounded-xl border p-6">
          <h2 className="mb-5 text-xl font-semibold">
            Order Summary
          </h2>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-start justify-between gap-3"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ৳{item.price} × {item.quantity}
                  </p>
                </div>

                <p className="font-semibold">
                  ৳{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="my-5 border-t" />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>৳{cartSubtotal}</span>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Payment is not collected online in this checkout flow.
          </p>
        </aside>
      </div>
    </main>
  );
}
