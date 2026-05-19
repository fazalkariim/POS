import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    tableNo: { 
      type: Number, 
      required: true 
    },
   items: [ 
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    name: String,
    price: Number,
    quantity: Number,
  },
],
    subtotal: Number,
    taxPercentage: Number,
    taxAmount: Number,
    serviceTaxPercentage: Number,
    serviceTaxAmount: Number,
    totalAmount: Number,
    paymentMethod: {
    type: String,
    enum: ["Cash", "Card"],
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  
    
  },
  { timestamps: true }
);

export default mongoose.model("Bill", billSchema);