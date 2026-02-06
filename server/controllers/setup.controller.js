import Setup from "../models/Setup.js";

const allowedKeys = [
  "Branch",
  "Rank",
  "VehicleBrand",
  "UserCategory",
  "JobLocation",
  "BRTALocation",
  "BRTADigit",
  "BloodGroup",
  "VehicleModel",
  "VehicleType",
  "SMSCategory",
  "Employee",
  "Department",
  "Designation",
];

export const getSetup = async (req, res) => {
  try {
    let setup = await Setup.findOne();

    if (!setup) {
      setup = await Setup.create({});
    }

    res.status(200).json(setup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addSetupItem = async (req, res) => {
  try {
    const { key, value } = req.body;

    if (!allowedKeys.includes(key)) {
      return res.status(400).json({ message: "Invalid setup key" });
    }

    if (!value || !String(value).trim()) {
      return res.status(400).json({ message: "Value is required" });
    }

    let setup = await Setup.findOne();
    if (!setup) setup = await Setup.create({});

    // Ensure array exists
    if (!Array.isArray(setup[key])) setup[key] = [];

    const normalizedValue = String(value).trim();

    const exists = setup[key].some(
      (item) => item.toLowerCase() === normalizedValue.toLowerCase(),
    );

    if (exists) {
      return res.status(400).json({
        message: `${normalizedValue} already exists in ${key}`,
      });
    }

    setup[key].push(normalizedValue);
    await setup.save();

    res.status(200).json({ message: "Item added", setup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeSetupItem = async (req, res) => {
  try {
    const { key, value } = req.body;

    if (!allowedKeys.includes(key)) {
      return res.status(400).json({ message: "Invalid setup key" });
    }

    if (!value || !String(value).trim()) {
      return res.status(400).json({ message: "Value is required" });
    }

    const setup = await Setup.findOne();
    if (!setup) {
      return res.status(404).json({ message: "Setup not initialized" });
    }

    if (!Array.isArray(setup[key])) setup[key] = [];

    const normalizedValue = String(value).trim().toLowerCase();

    const originalLength = setup[key].length;

    setup[key] = setup[key].filter(
      (item) => item.toLowerCase() !== normalizedValue,
    );

    if (setup[key].length === originalLength) {
      return res.status(404).json({
        message: `${value} not found in ${key}`,
      });
    }

    await setup.save();

    res.status(200).json({
      message: "Item removed successfully",
      setup,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
