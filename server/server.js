import { createServer } from "http";
import app from "./app.js";
import { HOSTNAME, PORT } from "./config/env.js";

const port = normalizePort(PORT);
const server = createServer(app);

server.listen(port, HOSTNAME);
server.on("listening", onListening);
server.on("error", onError);


function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string" ? `${addr}` : `${addr?.port}`;
    console.log(`Listening on http://localhost:${bind}`);
}

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
    switch (error.code) {
        case "EACCES":
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}