import Enrollment from "../models/Enrollment.js";

// Create enrollment
export const createEnrollment = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    const userId = req.user.id; // from auth middleware

    const enrollment = await Enrollment.create({
      ...data,
      createdBy: userId,
    });

    res.status(201).json({ message: "Enrollment created", enrollment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create enrollment" });
  }
};

// Get all enrollments
export const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find().sort({ createdAt: -1 });
    res.status(200).json(enrollments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch enrollments" });
  }
};

// Get enrollment by ID
export const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment)
      return res.status(404).json({ message: "Enrollment not found" });
    res.status(200).json(enrollment);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch enrollment" });
  }
};

// Update enrollment by ID
export const updateEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updated = await Enrollment.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return res.status(404).json({ message: "Enrollment not found" });

    res
      .status(200)
      .json({ message: "Enrollment updated", enrollment: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update enrollment" });
  }
};

// Delete enrollment by ID
export const deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Enrollment.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Enrollment not found" });

    res.status(200).json({ message: "Enrollment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete enrollment" });
  }
};
