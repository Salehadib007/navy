import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

export const registerUser = async (req, res) => {
  try {
    const {
      username,
      password,
      confirmPassword,
      employee,
      department,
      designation,
      access,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await hashPassword(password);

    const user = await User.create({
      username,
      password: hashed,
      employee,
      department,
      designation,
      access,
    });

    res.status(201).json({
      message: "User created",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, isActive: true });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      id: user._id,
      username: user.username,
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        employee: user.employee,
        department: user.department,
        designation: user.designation,
        access: user.access,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select(
        "_id username employee department designation access isActive createdAt",
      )
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/users/:id
 * Fetch single user (optional but useful for edit modal)
 */
export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(
      "_id username employee department designation access isActive createdAt",
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/users/:id
 * Update user info (NOT password)
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const payload = {
      employee: req.body.employee,
      department: req.body.department,
      designation: req.body.designation,
      access: req.body.access,
      isActive: req.body.isActive,
    };

    // remove undefined keys
    Object.keys(payload).forEach(
      (k) => payload[k] === undefined && delete payload[k],
    );

    const updated = await User.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).select(
      "_id username employee department designation access isActive createdAt",
    );

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "User updated successfully",
      user: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/users/:id
 * Delete user
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PATCH /api/users/:id/password
 * Simple password update (no reset-code)
 */
export const updateUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirmPassword are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashed = await hashPassword(password);

    const updated = await User.findByIdAndUpdate(
      id,
      { password: hashed },
      { new: true },
    ).select(
      "_id username employee department designation access isActive createdAt",
    );

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
