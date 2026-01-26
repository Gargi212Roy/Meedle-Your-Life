import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import {
	createMeedle,
	deleteMeedle,
	toggleLikeMeedle,
	addReply,
	getUserMeedles,
} from "../controllers/meedle.controller";

const router = Router();

router.post("/", protect, createMeedle);
router.delete("/:id", protect, deleteMeedle);
router.post("/:id/like", protect, toggleLikeMeedle);
router.post("/:id/replies", protect, addReply);
router.get("/:username/meedles", protect, getUserMeedles);

export default router;
