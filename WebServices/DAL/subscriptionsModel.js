const mongoose = require("mongoose");

const SubscriptionsSchema = new mongoose.Schema({
  _id: Number,
  MemberId: Number,
  Movies: [{ MovieId: Number, Date: Date }],
});

module.exports = mongoose.model("subscriptions", SubscriptionsSchema);
