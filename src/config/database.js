import dns from "node:dns";
import mongoose from "mongoose";

export const dbConnect = async () => {
  const mongoUri = process.env.MONGO_URI;
  const dnsServers = process.env.DNS_SERVERS?.split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (!mongoUri) {
    throw new Error("Definí MONGO_URI en el archivo .env antes de iniciar el servidor");
  }

  if (dnsServers?.length) {
    dns.setServers(dnsServers);
  }

  await mongoose.connect(mongoUri);
  console.log("Base de datos online");
};
