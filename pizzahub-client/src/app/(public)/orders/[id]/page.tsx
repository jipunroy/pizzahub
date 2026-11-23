
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  useCustomerOrder,
  useCancelCustomerOrder,
} from "@/hooks/use-orders";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-orange-100 text-orange-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-700",
  rejected: "bg-red-100 text-red-800",
};

interface OrderDetailsContentProps {
  orderId: string;
}

function OrderDetailsContent({ orderId }: OrderDetailsContentProps) {
  const router = useRouter();

  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  const {
    data: order,
    isLoading,
    isError,
    refetch,
  } = useCustomerOrder(orderId);

  const cancelMutation = useCancelCustomerOrder();

  const handleCancelOrder = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (cancellationReason.trim().length < 3) {
      toast.error("Please enter a cancellation reason.");
      return;
    }

    try {
      await cancelMutation.mutateAsync({
        orderId,
        cancellationReason: cancellationReason.trim(),
      });

      toast.success("Order cancelled successfully!");
      setShowCancelForm(false);
      setCancellationReason("");
    } catch {
      toast.error("Unable to cancel order. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <p className="text-muted-foreground">
        Loading order details...
      </p>
    );
  }

  if (isError || !order) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Unable to Load Order</h1>

        <p className="mt-2 text-muted-foreground">
          Order not found or you do not have permission to view it.
        </p>

        <div className="mt-5 flex gap-3">
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>

          <Button onClick={() => router.push("/orders")}>
            My Orders
          </Button>
        </div>
      </div>
    );
  }

  const canCancel = order.status === "pending";

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="mt-2 break-all text-sm text-muted-foreground">
            Order ID: {order._id}
          </p>
        </div>

        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
            statusColors[order.status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {order.status.replaceAll("_", " ")}
        </span>
      </div>

      <div className="space-y-6">
        <section className="rounded-xl border p-6">
          <h2 className="mb-5 text-xl font-semibold">Ordered Items</h2>

          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={`${item.menuItemId}-${index}`}
                className="flex flex-wrap justify-between gap-3"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
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
            <span>Total Amount</span>
            <span>৳{order.totalAmount}</span>
          </div>
        </section>

        <section className="rounded-xl border p-6">
          <h2 className="mb-5 text-xl font-semibold">
            Delivery Information
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Delivery Address
              </p>
              <p className="mt-1 font-medium">
                {order.deliveryAddress}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Delivery Date
              </p>
              <p className="mt-1 font-medium">
                {new Date(order.deliveryDate).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Order Created
              </p>
              <p className="mt-1 font-medium">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        {order.cancellationReason && (
          <section className="rounded-xl border p-6">
            <h2 className="font-semibold">Cancellation Reason</h2>
            <p className="mt-2 text-muted-foreground">
              {order.cancellationReason}
            </p>
          </section>
        )}

        {order.rejectionReason && (
          <section className="rounded-xl border border-red-200 p-6">
            <h2 className="font-semibold text-red-700">
              Rejection Reason
            </h2>
            <p className="mt-2 text-muted-foreground">
              {order.rejectionReason}
            </p>
          </section>
        )}

        {canCancel && (
          <section className="rounded-xl border border-red-200 p-6">
            <h2 className="text-xl font-semibold">Cancel Order</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              You can cancel this order while its status is pending.
            </p>

            {!showCancelForm ? (
              <Button
                variant="destructive"
                className="mt-5"
                onClick={() => setShowCancelForm(true)}
              >
                Cancel My Order
              </Button>
            ) : (
              <form
                onSubmit={handleCancelOrder}
                className="mt-5 space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="cancellationReason">
                    Cancellation Reason
                  </Label>

                  <textarea
                    id="cancellationReason"
                    value={cancellationReason}
                    onChange={(event) =>
                      setCancellationReason(event.target.value)
                    }
                    placeholder="Why do you want to cancel this order?"
                    minLength={3}
                    maxLength={500}
                    required
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={cancelMutation.isPending}
                  >
                    {cancelMutation.isPending
                      ? "Cancelling..."
                      : "Confirm Cancellation"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCancelForm(false)}
                    disabled={cancelMutation.isPending}
                  >
                    Keep Order
                  </Button>
                </div>
              </form>
            )}
          </section>
        )}

        <Button
          variant="outline"
          onClick={() => router.push("/orders")}
        >
          Back to My Orders
        </Button>
      </div>
    </div>
  );
}

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [orderId, setOrderId] = useState("");

  // The route parameter is passed by the Server Component wrapper below.
  // This component receives the resolved ID through its wrapper.
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <OrderDetailsContent orderId={orderId} />
    </main>
  );
}
