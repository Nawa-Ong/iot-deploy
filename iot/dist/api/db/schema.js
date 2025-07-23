import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
// export const genres = t.pgTable("genres", {
//   id: t.bigserial({ mode: "number" }).primaryKey(),
//   title: t
//     .varchar({
//       length: 255,
//     })
//     .notNull(),
// });
export const students = t.pgTable("students", {
    id: t.varchar({ length: 8 }).primaryKey(),
    fname: t.varchar({ length: 255 }).notNull(),
    lname: t.varchar({ length: 255 }).notNull(),
    birth_date: t.date().defaultNow().notNull(),
    gender: t.varchar({ length: 255 }).notNull()
});
