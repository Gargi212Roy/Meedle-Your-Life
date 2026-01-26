import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { followUser, unfollowUser } from "../controllers/follow.controller";

const router = Router();

router.post("/:id/follow", protect, followUser);
router.post("/:id/unfollow", protect, unfollowUser);

export default router;
