import Setting from "../models/Setting.js";

// GET TAX
export const getTax = async (req, res) => {
  try {

    let setting = await Setting.findOne();

    if (!setting) {
      setting = await Setting.create({
        taxPercentage: 0,
      });
    }

    res.json(setting);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE TAX
export const updateTax = async (
  req,
  res
) => {
  try {

    const { taxPercentage } = req.body;

    let setting = await Setting.findOne();

    if (!setting) {
      setting = await Setting.create({
        taxPercentage,
      });
    } else {
      setting.taxPercentage =
        taxPercentage;

      await setting.save();
    }

    res.json(setting);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};