import { Server } from "http";
import app from "./app";
import env from "./config/env";

let server: Server;

const bootstrap = async () => {
  try {
    server = app.listen(env.port, () => {
      console.log("Server is running on port: ", env.port);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await bootstrap();
})();

// Kills the process when -> promise rejects but there's .catch() or try/catch
process.on("unhandledRejection", (err) => {
  console.log("Unhandled asynchronous Error detected", err);
  if (server) {
    server.close(() => {
      process.exit(1); //Unexpected error/Crash
    });
  }
  process.exit(1);
});

// Kills the process when -> synchronous error thrown but not caught
process.on("unhandledRejection", (err) => {
  console.log("Unhandled synchronous Error detected", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// App is being told to shut down by deployed server, hosting platform or process manager
process.on("SIGTERM", (err) => {
  console.log("Process killed by server/host", err);
  if (server) {
    server.close(() => {
      process.exit(0); //0= Intentional/Success
    });
  }
  process.exit(0);
});
