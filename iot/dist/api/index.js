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
const PORT = parseInt(process.env.PORT || '3000');

// This variable is provided by Railway after you generate a public domain.
const RAILWAY_PUBLIC_DOMAIN = process.env.RAILWAY_PUBLIC_DOMAIN;

// Construct the full URL for production, or use localhost for development.
// Railway handles SSL, so we can safely use https.
const DEPLOYMENT_URL = RAILWAY_PUBLIC_DOMAIN
  ? `https://${RAILWAY_PUBLIC_DOMAIN}`
  : `http://localhost:${PORT}`;

app.get('/', (c) => {
  return c.text(`Server is running! Access it at ${DEPLOYMENT_URL}`);
});

serve({
  fetch: app.fetch,
  port: PORT,
  // On Railway, it's best to bind to '::' to accept both IPv4 and IPv6 traffic.
  // See: https://docs.railway.app/guides/private-networking#listen-on-ipv6
  hostname: '::', 
}, (info) => {
  console.log(`Server is running locally on http://localhost:${info.port}`);
  if (RAILWAY_PUBLIC_DOMAIN) {
    console.log(`Server is publicly available at: ${DEPLOYMENT_URL}`);
  }
});