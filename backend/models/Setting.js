import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  taxPercentage: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model(
  "Setting",
  settingSchema
);