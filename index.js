import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnect } from "./src/config/database.js";
import authRouter from "./src/routes/auth.routes.js";
import taskRouter from "./src/routes/task.routes.js";
import categoryRouter from "./src/routes/category.routes.js";
import productRouter from "./src/routes/product.routes.js";
import cartRouter from "./src/routes/cart.routes.js";

const app = express();
const port = 4500;

// Middlewares globales
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(cors());

// Conexión a la base de datos
await dbConnect();

// Rutas principales
app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);

app.listen(port, () => {
  console.log(`Server online en puerto: ${port}`);
});
