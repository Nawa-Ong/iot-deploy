import { Hono } from "hono";
import { cors } from "hono/cors";
import apiRouter from "./routes/api.js";
import { serve } from "@hono/node-server";
import * as dotenv from 'dotenv';
dotenv.config();
const app = new Hono();
app.use("*", cors({
    origin: "http://localhost:5173",
    allowHeaders: ["Content-Type"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));
app.route("/v1", apiRouter);
const PORT = 3000;
serve({
    fetch: app.fetch,
    port: PORT,
}, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
