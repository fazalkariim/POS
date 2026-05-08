import Bill from "../models/Bill.js";

// 🧾 CREATE BILL
export const createBill = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const { tableNo, items, totalAmount } = req.body;

    const bill = await Bill.create({
      tableNo,
      items,
      totalAmount,
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
// export const getBills = async (req, res) => {
//   try {
//     const bills = await Bill.find().sort({ createdAt: -1 });
//     res.json(bills);
//   } catch (error) {
//     console.log("GET BILLS ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// };