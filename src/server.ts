import { Server } from "http";
import app, { httpsOptions } from "./app";
import config from "./config";
import https from "https";
import seedAdmin, { connectDB } from "./app/db";
import "./app/bullMQ/init";

const port = config.port || 5001;

async function main() {
  // Express + HTTP server
  const httpServer: Server = https
    .createServer(httpsOptions, app)
    .listen(port, () => {
      console.log("HTTPS server running on https://16.170.226.171:5001");
      connectDB();
      seedAdmin();
    });

  // graceful shutdown
  const exitHandler = () => {
    if (httpServer) httpServer.close(() => console.info("Server closed!"));
    process.exit(1);
  };

  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection:", error);
    exitHandler();
  });
}

main();
