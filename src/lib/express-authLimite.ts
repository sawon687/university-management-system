import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 1, // 20 requests
	message: {
		success: false,
		message: "Too many requests. Please try again later.",
		errors: [],
	},
});
