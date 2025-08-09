import z from "zod";

export const TodoPrioritySchema = z.enum(["low", "medium", "high"]);

export const TodoSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  createdAt: z.date(),
  due: z.date().optional(),
  priority: TodoPrioritySchema,
  notes: z.string().optional(),
  tags: z.array(z.string()),
});

export const CreateTodoSchema = z.object({
  id: z.string(),
  title: z.string(),
  due: z.date().optional(),
  priority: TodoPrioritySchema,
  notes: z.string().optional(),
  tags: z.array(z.string()),
});

export const UpdateTodoSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  due: z.date().optional(),
  notes: z.string().optional(),
  priority: TodoPrioritySchema,
  tags: z.array(z.string()),
});

export const AddTagSchema = z.object({
  value: z.array(z.string()),
  onChange: z.custom<(tags: string[]) => void>((v) => typeof v === "function", {
    error: () => "onChange must be a function",
  }),
  placeholder: z.string().optional(),
  maxTags: z.number().optional(),
});

export const DeleteTodoSchema = z.object({
  id: z.string(),
});

export type TodoPrioritySchemaType = z.infer<typeof TodoPrioritySchema>;
export type TodoSchemaType = z.infer<typeof TodoSchema>;
export type CreateTodoSchemaType = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoSchemaType = z.infer<typeof UpdateTodoSchema>;
export type DeleteTodoSchemaType = z.infer<typeof DeleteTodoSchema>;
export type AddTagSchemaType = z.infer<typeof AddTagSchema>;
