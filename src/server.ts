import { Server } from "http";
import app from "./app";
import config from "./config";
import seedAdmin, { connectDB } from "./app/db";



const port = config.port || 5001;

async function main() {
  // Express + HTTP server
  const httpServer: Server = app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
    seedAdmin();
    connectDB();
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
