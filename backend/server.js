import http from "http";
import { config } from "dotenv";
config();
import app from "./app.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const initialPort = process.env.PORT ? Number(process.env.PORT) : 5000;
const maxRetries = 10;

function startServer(port, retriesLeft) {
  const server = http.createServer(app);

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE" && retriesLeft > 0) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is in use, trying ${nextPort}...`);
      startServer(nextPort, retriesLeft - 1);
    } else {
      console.error(err);
      process.exit(1);
    }
  });

  server.listen(port, () => {
    console.log(`Server listening at port ${port}`);
  });
}

startServer(initialPort, maxRetries);
