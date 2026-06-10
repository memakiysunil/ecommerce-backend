const { default: mongoose } = require("mongoose");
 const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number
        },
        price: {
          type: Number,
          required: true
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
      country: String
    },

    paymentMethod: {
      type: String, 
      enum: ['COD', 'UPI', 'CARD'],
      default:"COD"
    },
 
    isPaid: {
      type: Boolean,
      default: false
    },

    paidAt: Date,

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'confirmed'
    },

    deliveredAt: Date
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;