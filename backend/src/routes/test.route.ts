import { Router, Request, Response } from "express";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/me", protect, (req: Request, res: Response) => {
	res.json({
		success: true,
		userId: req.user?.id,
	});
});

export default router;
