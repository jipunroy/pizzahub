
"use client";

import Link from "next/link";
import { useCustomerOrders } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  const { data, isLoading, isError, refetch } = useCustomerOrders();

const orders = Array.isArray(data?.orders) ? data.orders : [];

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="mt-5 text-muted-foreground">Loading orders...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="mt-5 text-red-600">
          Unable to load your orders.
        </p>
        <Button onClick={() => refetch()} className="mt-4">
          Try Again
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">My Orders</h1>
      <p className="mt-2 text-muted-foreground">
        Track your PizzaHub orders.
      </p>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-xl border p-10 text-center">
          <h2 className="text-xl font-semibold">
            No Orders Yet
          </h2>
          <p className="mt-2 text-muted-foreground">
            Your placed orders will appear here.
          </p>
          <Link
  href="/menu"
  className="mt-5 inline-flex rounded-md bg-primary px-5 py-2 text-primary-foreground"
>
  Browse Menu
</Link>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl border p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    Order #{order._id}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium capitalize text-orange-700">
                  {order.status.replaceAll("_", " ")}
                </span>
              </div>

              <div className="my-4 border-t" />

              {order.items.map((item, index) => (
                <div
                  key={`${item.menuItemId}-${index}`}
                  className="flex justify-between gap-3 py-2"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ৳{item.price * item.quantity}
                  </span>
                </div>
              ))}

              <div className="my-4 border-t" />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-bold">
                  Total: ৳{order.totalAmount}
                </p>

                <Link
  href={`/orders/${order._id}`}
  className="inline-flex rounded-md border px-4 py-2 text-sm hover:bg-muted"
>
  View Details
</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
