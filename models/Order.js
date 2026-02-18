import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      fullName: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: false,
      },
      state: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: true,
      },
      phoneNo: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
        default: "India",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        uploadedImage: {
          type: [String],
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "products",
        },
        customNameToPrint: {
          type: String,
          required: false,
        },
      },
    ],
    paymentMethod: {
      type: String,
      required: [true, "Please select payment method"],
      enum: {
        values: ["COD", "Online", "Partial-COD"],
        message: "Please select COD or Online Payments",
      },
    },
    advancePaidAt: {
      type: Date,
      default: null,
    },

    remainingAmount: {
      type: Number,
      default: function () {
        return this.totalAmount - (this.advancePaid || 0);
      },
    },
    codAmount: {
      type: Number,
      default: function () {
        if (this.paymentMethod === "Partial-COD") {
          return this.remainingAmount;
        }
        return this.paymentMethod === "COD" ? this.totalAmount : 0;
      },
    },
    paymentInfo: {
      id: String,
      status: String,
    },
    advancePaid: {
      type: Number,
      default: 0,
      min: [0, "Advance paid cannot be negative"],
    },
    itemsPrice: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    shippingAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    codChargeCollected: {
      type: Number,
      default: 100, // Default value — change here if needed
      min: [0, "COD charge cannot be negative"],
    },
    orderStatus: {
      type: String,
      default: "Processing",
      enum: {
        values: ["Processing", "Shipped", "Delivered"],
        message: "Please select valid order status",
      },
    },
    shiprocketOrderId: {
      type: String,
      required: false,
    },
    orderNotes: {
      type: String,
      required: false,
    },
    couponApplied: {
      type: String,
      required: false,
      default: "No",
    },
    discountAmount: {
      type: Number,
      required: false,
      default: 0,
    },
    couponDiscountType: {
      type: String,
      required: false,
    },
    couponDiscountValue: {
      type: Number,
      required: false,
    },
    deliveredAt: Date,
  },
  { timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
