import dotenv from 'dotenv';
dotenv.config();

import app from ".";
import logger from "./helpers/logger";
import { handler } from "./helpers/error";
import http from "http";
import mongoose from "mongoose";

const server = http.createServer(app);

const PORT = process.env.PORT || 9600;

const closeOpenConnections = (errorOccurred: boolean) => {
    logger.info('Shutting down server and open connections');
    server.close(() => {
        logger.info('Server shut down');
        mongoose.connection.close(() => {
            logger.info('Mongoose connection closed');
            process.exit(errorOccurred ? 1 : 0);
        });
    });
  };

server.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
})

process.on('unhandledRejection', reason => {
    console.log("Herr: ", reason);
    throw reason;
});

process.on('uncaughtException', (error: Error) => {
    handler.handleError(error);
    if (!handler.isTrustedError(error)) {
        closeOpenConnections(true);
    }
});

process.on('SIGTERM', () => {
    logger.info('SIGTERM Signal Received');
    closeOpenConnections(false);
});

process.on('SIGINT', () => {
    logger.info('SIGINT Signal Received');
    closeOpenConnections(false);
});