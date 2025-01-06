import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from 'dotenv'
import { roomServer } from "./room";

dotenv.config()

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

roomServer(io)



const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
