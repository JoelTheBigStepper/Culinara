import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ─── Token Generators ─────────────────────────────────────────
const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ─── Register ─────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const user = await User.create({ name, email, password, avatar: avatar || "" });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in DB
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    res.status(201).json({
      user,
      accessToken,
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Registration failed" });
  }
};

// ─── Login ────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in DB
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    res.json({
      user,
      accessToken,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Login failed" });
  }
};

// ─── Refresh Access Token ─────────────────────────────────────
export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    // Verify signature first
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    // Check token exists in DB (not revoked)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const tokenInDB = user.refreshTokens.find((t) => t.token === token);
    if (!tokenInDB) {
      // Token was revoked (logged out) — clear cookie
      res.clearCookie("refreshToken", COOKIE_OPTIONS);
      return res.status(401).json({ message: "Refresh token revoked" });
    }

    // Rotate: remove old, issue new
    user.refreshTokens = user.refreshTokens.filter((t) => t.token !== token);
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();

    const newAccessToken = generateAccessToken(user._id);

    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Refresh error:", err.message);
    res.status(500).json({ message: "Could not refresh token" });
  }
};

// ─── Logout ───────────────────────────────────────────────────
export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      // Remove this specific refresh token from DB (single device logout)
      await User.findOneAndUpdate(
        { "refreshTokens.token": token },
        { $pull: { refreshTokens: { token } } }
      );
    }

    res.clearCookie("refreshToken", COOKIE_OPTIONS);
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err.message);
    res.status(500).json({ message: "Logout failed" });
  }
};

// ─── Get Current Auth User ────────────────────────────────────
export const getMe = async (req, res) => {
  res.json(req.user);
};