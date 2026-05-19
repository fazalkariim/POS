import Bill from "../models/Bill.js";


// 🧾 CREATE BILL
export const createBill = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

  const {
  tableNo,
  items,
  subtotal,
  taxPercentage,
  taxAmount,

  serviceTaxPercentage,
  serviceTaxAmount,

  totalAmount,
  paymentMethod,
} = req.body;

  const bill = await Bill.create({
  tableNo, 
  items,
  subtotal,
  taxPercentage,
  taxAmount,

  serviceTaxPercentage,
  serviceTaxAmount,
  
  totalAmount,
  paymentMethod,
  createdBy: req.user?._id || null,
});

    res.status(201).json(bill);
  } catch (error) {
    console.log("CREATE BILL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// 📄 GET ALL BILLS
export const getBills = async (req, res) => {
  const bills = await Bill.find().sort({ createdAt: -1 }); 
  res.json(bills);
};
// 📄 GET SINGLE BILL
export const getSingleBill = async (req, res) => {
  try {
    const bill = await Bill.findById(
      req.params.id
    );

    res.json(bill);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};