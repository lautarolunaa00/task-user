import dns from "node:dns";
import mongoose from "mongoose";

// Fix para redes que bloquean registros SRV de MongoDB Atlas
dns.setServers(["1.1.1.1", "1.0.0.1"]);

export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Base de datos conectada");
  } catch (error) {
    console.log("Error de conexión", error);
  }
};