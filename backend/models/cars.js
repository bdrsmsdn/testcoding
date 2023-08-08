const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    carName: {
      type: String,
      required: true,
    },
    carType: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    fuel: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    hourRate: {
      type: String,
      required: true,
    },
    dayRate: {
      type: String,
      required: true,
    },
    monthRate: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'cars',
  }
);

module.exports = mongoose.model('Cars', carSchema);
