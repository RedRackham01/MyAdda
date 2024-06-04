import express from "express";
import {
  getUserController,
  getUserFriendsController,
  addRemoveFriendController,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUserController);
router.get("/:id/friends", verifyToken, getUserFriendsController);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriendController);

export default router;