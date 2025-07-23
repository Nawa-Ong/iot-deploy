import { Hono } from "hono";
import studentsRouter from "./students.ts";
import { bearerAuth } from "hono/bearer-auth";
import { env } from "hono/adapter";

const apiRouter = new Hono();

apiRouter.get("/", (c) => {
  return c.json({ message: "Student API" });
});

apiRouter.use(
  "*",
  bearerAuth({
    verifyToken: async (token, c) => {
      const apiSecret = process.env.API_SECRET;
      return token === apiSecret;
    },
  })
);

apiRouter.route("/students", studentsRouter);

export default apiRouter;
