import mongoose from "mongoose";

const sessionStartedOrderSchema = new mongoose.Schema(
  {
    razorpayOrderId: {
      type: String,
      required: true,
    },

    razorpayPaymentStatus: {
      type: String,
      default: "created",
    },

    // ─────────────────────────────────────────────────────────────
    // NEW fields added for partial/advance payment support
    // ─────────────────────────────────────────────────────────────
    paymentMethod: {
      type: String,
      enum: ["Online", "Partial-COD"],
      default: "Online",
      required: true, // makes it mandatory → easier to distinguish flows
    },

    // What this Razorpay session is actually charging (full total or advance only)
    paymentAmount: {
      type: Number,
      default: function () {
        return this.totalAmount || 0; // default to full total for backward compatibility
      },
      min: 0,
    },

    // For Partial-COD: the amount already paid / to be paid via Razorpay in this session
    advancePaidInThisSession: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Fixed COD charge (₹100) — stored so it's clear and auditable
    codCharge: {
      type: Number,
      default: 100,
    },
    // ─────────────────────────────────────────────────────────────

    shippingInfo: {
      fullName: { type: String, required: false },
      address: { type: String, required: true },
      email: { type: String, required: false },
      state: { type: String, required: false },
      city: { type: String, required: true },
      phoneNo: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true, default: "India" },
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    orderItems: [
      {
        name: { type: String, required: true },
        uploadedImage: { type: [String], required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: String, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "products",
        },
        customNameToPrint: { type: String, required: false },
      },
    ],

    paymentInfo: {
      id: String,
      status: String,
    },

    itemsPrice: { type: Number, required: true },

    // This field already exists — we keep it as the FULL order value
    totalAmount: { type: Number, required: true },

    orderNotes: { type: String, required: false },

    deliveredAt: Date,
  },
  { timestamps: true },
);


// Auto-expire old sessions (optional but recommended)
sessionStartedOrderSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7200 }); // 2 hours

const SessionStartedOrder =
  mongoose.models.SessionStartedOrder ||
  mongoose.model("SessionStartedOrder", sessionStartedOrderSchema);

export default SessionStartedOrder;
