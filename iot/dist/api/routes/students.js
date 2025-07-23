import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { students } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import dayjs from "dayjs";
const studentsRouter = new Hono();
studentsRouter.get("/", async (c) => {
    const allStudents = await drizzle.select().from(students);
    return c.json(allStudents);
});
studentsRouter.get("/:id", async (c) => {
    const id = String(c.req.param("id"));
    const result = await drizzle.query.students.findFirst({
        where: eq(students.id, id),
    });
    if (!result) {
        return c.json({ error: "Students not found" }, 404);
    }
    return c.json(result);
});
studentsRouter.post("/", zValidator("json", z.object({
    id: z.string().min(1),
    fname: z.string().min(1),
    lname: z.string().min(1),
    birth_date: z.iso.date(),
    gender: z.string().min(1),
})), async (c) => {
    const { id, fname, lname, birth_date, gender } = c.req.valid("json");
    const result = await drizzle
        .insert(students)
        .values({
        id,
        fname,
        lname,
        birth_date,
        gender,
    })
        .returning();
    return c.json({ success: true, student: result[0] }, 201);
});
studentsRouter.patch("/:id", zValidator("json", z.object({
    id: z.string().min(1).optional(),
    fname: z.string().min(1).optional(),
    lname: z.string().min(1).optional(),
    birth_date: z.iso.date().optional(),
    gender: z.string().min(1).optional(),
})), async (c) => {
    const id = String(c.req.param("id"));
    const data = c.req.valid("json");
    const updated = await drizzle.update(students).set(data).where(eq(students.id, id)).returning();
    if (updated.length === 0) {
        return c.json({ error: "Student not found" }, 404);
    }
    return c.json({ success: true, student: updated[0] });
});
studentsRouter.delete("/:id", async (c) => {
    const id = String(c.req.param("id"));
    const deleted = await drizzle.delete(students).where(eq(students.id, id)).returning();
    if (deleted.length === 0) {
        return c.json({ error: "Students not found" }, 404);
    }
    return c.json({ success: true, student: deleted[0] });
});
export default studentsRouter;
