import express from 'express';
import {
  authUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getUserProfile,
  registerUser,
  updateUser,
  updateUserProfile,
} from '../controllers/userController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route("/login").post(authUser);
router.route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route("/")
  .post(registerUser)
  .get(protect, admin, getAllUsers);
router.route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;