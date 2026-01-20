import app from "./app.js";
import db from "./config/db.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, closing server...");
  server.close(async () => {
    await db.end();
    console.log("Server and database connections closed");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, closing server...");
  server.close(async () => {
    await db.end();
    console.log("Server and database connections closed");
    process.exit(0);
  });
});
