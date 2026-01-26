import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller";
import { SUCCESS_MESSAGES } from "../constants/successMessages";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, (req, res) => {
	res.clearCookie("token", {
		httpOnly: true,
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
		secure: process.env.NODE_ENV === "production",
	}).json({
		success: true,
		message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
	});
});
router.get("/me", protect, (req, res) => {
	res.json({
		success: true,
		data: {
			id: req.user?.id,
			username: req.user?.username,
		},
	});
});
export default router;
