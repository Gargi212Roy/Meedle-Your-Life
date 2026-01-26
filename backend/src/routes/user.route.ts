import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import {
	getCurrentUser,
	getUserByUsername,
	getUserLikedMeedles,
	getUserReplies,
	searchUsers,
	updateBio,
} from "../controllers/user.controller";

const router = Router();

// current user
router.get("/me", protect, getCurrentUser);
router.patch("/me", protect, updateBio);
router.get("/:username/replies", protect, getUserReplies);
router.get("/:username/likes", protect, getUserLikedMeedles);
router.get("/search", protect, searchUsers);

router.get("/:username", protect, getUserByUsername);

export default router;
