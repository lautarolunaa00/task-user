import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  getSuccess,
  postPreference,
  postWebhook,
} from "../controllers/mercado.controller.js";

const router = Router();

router.post("/create_preference", authenticate, postPreference);
router.post("/webhook", postWebhook);
router.get("/success", getSuccess);

router.get("/failure", (req, res) => {
  const { status } = req.query;

  return res.send(
    `<h1>El pago no se pudo completar</h1><p>Estado: ${status || "Rechazado/Cancelado"}</p>`,
  );
});

export default router;
