import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  postPreference,
  postWebhook,
} from "../controllers/mercado.controller.js";

const router = Router();

router.post("/create_preference", authenticate, postPreference);
router.post("/webhook", postWebhook);

export default router;
