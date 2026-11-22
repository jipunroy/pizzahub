
import mongoose, {
  Schema,
  type InferSchemaType,
} from "mongoose";

const orderSchema = new Schema(
  {
    customerId: {
      type: String,
      required: true,
      index: true,
    },

    vendorId: {
      type: String,
      required: true,
      index: true,
    },

    items: [
      {
        menuItemId: {
          type: Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        imageUrl: {
          type: String,
          default: "",
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },

    deliveryDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "rejected",
      ],
      default: "pending",
      index: true,
    },

    // Customer cancellation reason
    cancellationReason: {
      type: String,
      default: null,
    },

    // Vendor rejection reason
    rejectionReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export type OrderDocument = InferSchemaType<
  typeof orderSchema
>;

const Order =
  mongoose.models.Order ||
  mongoose.model("Order", orderSchema);

export default Order;
