// SERVER CON NODE:HTTP
// import { createServer } from "node:http";

// const server = createServer((req, res) => {
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end("Bienvenidos al Backend!\n");
// });

// server.listen(3000, "127.0.0.1", () => {
//   console.log("Listening on 127.0.0.1:3000");
// });

//Express
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnect } from "./src/config/database.js";
import authRouter from "./src/routes/auth.routes.js";
import taskRouter from "./src/routes/task.routes.js";
import categoryRouter from "./src/routes/category.routes.js";
import productRouter from "./src/routes/product.routes.js";

const app = express();
const port = 4500;

if (!process.env.JWT_SECRET) {
  throw new Error(
    "Definí JWT_SECRET en el archivo .env antes de iniciar el servidor",
  );
}

//middleware -> función que está entre la req y la res
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public")); //configuramos la carpeta public para nuestras páginas web
app.use(cors());

await dbConnect();

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/task", taskRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/productos", productRouter);

app.listen(port, () => {
  console.log(`Server online en puerto: ${port}`);
});
