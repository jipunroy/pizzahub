import mongoose, {
  Schema,
  type InferSchemaType,
} from "mongoose";

const menuItemSchema = new Schema(
  {
    // Better Auth user ID of the vendor
    vendorId: {
      type: String,
      required: true,
      index: true,
    },

    // Pizza or food item name
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    // Item description
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    // Item price
    price: {
      type: Number,
      required: true,
      min: 0.01,
    },

    // Item category
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // Uploaded image URL from ImgBB
    imageUrl: {
      type: String,
      default: "",
    },

    // List of ingredients
    ingredients: {
      type: [String],
      default: [],
    },

    // Vegetarian item
    isVegetarian: {
      type: Boolean,
      default: false,
    },

    // Spicy item
    isSpicy: {
      type: Boolean,
      default: false,
    },

    // Vendor can activate or deactivate an item
    isActive: {
      type: Boolean,
      default: true,
    },

    // Every new item must be approved by an admin
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    // Admin rejection reason
    rejectionReason: {
      type: String,
      default: null,
    },

    // Featured items are controlled by the server/admin
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Public menu filtering
menuItemSchema.index({
  status: 1,
  isActive: 1,
  createdAt: -1,
});

// Vendor dashboard filtering
menuItemSchema.index({
  vendorId: 1,
  isActive: 1,
});

// Price sorting
menuItemSchema.index({
  price: 1,
});

// TypeScript document type
export type MenuItemDocument = InferSchemaType<
  typeof menuItemSchema
>;

// Prevent model recompilation errors
const MenuItem =
  mongoose.models.MenuItem ||
  mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;
