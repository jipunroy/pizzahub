
"use client";

import Link from "next/link";
import { useCustomerOrders } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Package,
} from "lucide-react";

export default function CustomerDashboardPage() {
  const { data, isLoading, isError, refetch } = useCustomerOrders(1, 100);

  // Backend response: { orders: [...], pagination: {...} }
  const orders = Array.isArray(data?.orders) ? data.orders : [];

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled"
  ).length;

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      title: "Delivered Orders",
      value: deliveredOrders,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Cancelled Orders",
      value: cancelledOrders,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-muted-foreground">
          Loading your dashboard...
        </p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-2xl font-bold">
          Unable to load dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Something went wrong while fetching your orders.
        </p>

        <Button className="mt-4" onClick={() => refetch()}>
          Try Again
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      {/* Dashboard Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            My Dashboard
          </h1>

          <p className="mt-2 text-muted-foreground">
            Welcome to your PizzaHub customer dashboard.
          </p>
        </div>

        <Link
          href="/menu"
          className="inline-flex rounded-md bg-primary px-5 py-2 text-primary-foreground hover:opacity-90"
        >
          Order Pizza
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {stat.title}
                </p>

                <div className={`rounded-lg p-3 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>

              <p className="mt-4 text-3xl font-bold">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <section className="mt-10 rounded-xl border p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">
            Recent Orders
          </h2>

          <Link
            href="/orders"
            className="text-sm font-medium text-primary hover:underline"
          >
            View All Orders
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-10 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />

            <h3 className="mt-4 font-semibold">
              No orders yet
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Start ordering your favorite pizzas!
            </p>

            <Link
              href="/menu"
              className="mt-5 inline-flex rounded-md bg-primary px-5 py-2 text-primary-foreground hover:opacity-90"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-semibold">
                    {order.items.map((item) => item.name).join(", ")}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Order #{order._id}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">
                      ৳{order.totalAmount}
                    </p>

                    <p className="text-sm capitalize text-muted-foreground">
                      {order.status.replaceAll("_", " ")}
                    </p>
                  </div>

                  <Link
                    href={`/orders/${order._id}`}
                    className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
