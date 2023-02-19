import express from "express";
import {
  createUser,
  deleteMe,
  deleteUser,
  getAllUsers,
  getUser,
  updateMe,
  updateUser,
} from "../controllers/usersController";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
} from "../controllers/authController";

const router = express.Router();

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

// auth
router.post("/signup", signup);
router.post("/login", login);

// reset password
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.patch("/update-my-password", protect, updatePassword);

// updating current user
router.patch("/update-me", protect, updateMe);
router.delete("/delete-me", protect, deleteMe);

export default router;
