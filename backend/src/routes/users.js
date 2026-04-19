import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { getProfile, updateProfile, validateUpdate, getUserById } from "../controllers/usersController.js";

const router = Router();

router.get("/me", authenticate, getProfile);
router.put("/me", authenticate, validateUpdate, updateProfile);
router.get("/:id", authenticate, getUserById);

export default router;

