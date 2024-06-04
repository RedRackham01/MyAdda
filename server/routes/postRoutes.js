import express from "express";
import { getFeedPostsController, getUserPostsController, likePostController, createPostController } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../helpers/storageHelper.js";

const router = express.Router();

/* CREATE */
router.post("/", verifyToken, upload.single("picture"), createPostController);

/* READ */
router.get("/", verifyToken, getFeedPostsController);
router.get("/:userId/posts", verifyToken, getUserPostsController);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePostController);

export default router;
