import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { getFeed } from "../controllers/feed.controller";

const router = Router();

router.get("/", protect, getFeed);

export default router;
