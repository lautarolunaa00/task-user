import { Schema, model } from "mongoose";

const MercadoSchema = new Schema(
  {
    payment_id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    external_reference: {
      type: String,
    },
    merchant_order_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default model("Mercado", MercadoSchema);
