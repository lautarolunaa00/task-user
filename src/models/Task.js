import { Schema, model } from "mongoose";

const TaskSchema = new Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
    },
    descripcion: {
      type: String,
      default: "",
      trim: true,
    },
    fechaEntrega: {
      type: Date,
      default: null,
    },
    completada: {
      type: Boolean,
      default: false,
    },
    categoria: {
      type: Schema.Types.ObjectId,
      ref: "Categoria",
      default: null,
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model("Task", TaskSchema);
