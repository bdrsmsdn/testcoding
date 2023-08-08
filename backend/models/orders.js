const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    pickupLoc: {
      type: String,
      required: true,
    },
    dropoffLoc: {
      type: String,
      required: true,
    },
    pickupDate: {
      type: Date,
      required: true,
    },
    dropoffDate: {
      type: Date,
      required: true,
    },
    pickupTime: {
      type: String,
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cars',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
  },
  {
    collection: 'orders',
    timestamps: true,
  }
);

module.exports = mongoose.model('Orders', orderSchema);
