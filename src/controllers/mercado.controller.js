import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import Mercado from "../models/Mercado.js";

export const cliente = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN,
});

export const postPreference = async (_req, res) => {
  try {
    const preference = new Preference(cliente);

    const response = await preference.create({
      body: {
        items: [
          {
            title: "Producto de prueba",
            unit_price: 100,
            quantity: 1,
            currency_id: "ARS",
          },
        ],
        back_urls: {
          success:
            "https://bd5d-2803-9800-9443-a98a-c9f0-a379-ed9a-e266.ngrok-free.app/api/mercado/success",
          failure:
            "https://bd5d-2803-9800-9443-a98a-c9f0-a379-ed9a-e266.ngrok-free.app/api/mercado/failure",
          pending: "https://misitio.com/pendiente",
        },
        auto_return: "approved",
        notification_url:
          "https://bd5d-2803-9800-9443-a98a-c9f0-a379-ed9a-e266.ngrok-free.app/api/mercado/webhook",
      },
    });

    return res.status(201).json({
      ok: true,
      preferenceId: response.id,
      initPoint: response.init_point,
    });
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

export const postWebhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    const topic = type || req.query.topic || req.query.type;
    const paymentId = data?.id || req.query["data.id"] || req.query.id;

    if (topic === "payment" && paymentId) {
      const payment = new Payment(cliente);

      const paymentData = await payment.get({ id: paymentId });

      console.log(`Estado del pago ${paymentId}:`, paymentData.status);

      if (paymentData.status === "approved") {
        console.log("El pago fue aprobado exitosamente!!");
        return res.status(200).json({
          ok: true,
          message: "El pago fue aprobado exitosamente!!",
        });
      }
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error("Error procesando el webhook:", error);
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

export const getSuccess = async (req, res) => {
  const { payment_id, status, external_reference, merchant_order_id } =
    req.query;

  console.log("Datos recibidos en entorno de éxito:", {
    payment_id,
    status,
    external_reference,
    merchant_order_id,
  });

  const mercado = new Mercado({
    payment_id,
    status,
    external_reference,
    merchant_order_id,
  });
  await mercado.save();

  return res.send(
    `<h1>¡Gracias por tu compra!</h1><p>Tu pago <strong>#${payment_id}</strong> fue procesado con éxito.</p><p>Referencia de pedido: <strong>${external_reference}</strong></p>`,
  );
};
