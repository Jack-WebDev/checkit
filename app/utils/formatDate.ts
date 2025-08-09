import { TodoSchemaType } from "../schema";

export const createdTs = (t: TodoSchemaType) => {
  const c = (t as any).createdAt ?? (t as any).created_at ?? null;
  return c ? new Date(c).getTime() : 0;
};
