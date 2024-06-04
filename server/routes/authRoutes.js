import express from "express";
import { loginController, registerController } from "../controllers/auth.js";
import { upload } from "../helpers/storageHelper.js";

const router = express.Router();

router.post("/register", upload.single("picture"), registerController);

router.post("/login", loginController);

export default router;