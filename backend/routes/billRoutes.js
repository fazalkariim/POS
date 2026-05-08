import express from "express";
import { createBill, getBills } from "../controllers/billController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBill);
router.get("/", protect, getBills);
 
export default router;