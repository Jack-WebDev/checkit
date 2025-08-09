import { TodoSchemaType, UpdateTodoSchemaType } from "@/app/schema";
import { STORE_KEY } from "@/app/utils";

const isBrowser = () => typeof window !== "undefined";

function reviveDates<T extends { due?: Date | string }>(arr: T[]): T[] {
  return arr.map((t) =>
    t?.due && typeof t.due === "string" ? { ...t, due: new Date(t.due) } : t
  );
}

export function getTodo(): TodoSchemaType[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const parsed = raw ? (JSON.parse(raw) as TodoSchemaType[]) : [];
    return reviveDates(parsed) as TodoSchemaType[];
  } catch {
    return [];
  }
}

export function setTodo(next: TodoSchemaType[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORE_KEY, JSON.stringify(next));
  // notify same-tab listeners
  window.dispatchEvent(new CustomEvent("TodoSchemaTypes:update"));
}

export function addTodo(todo: TodoSchemaType) {
  const todos = getTodo();

  const exists = todos.some(
    (t) => t.title.trim().toLowerCase() === todo.title.trim().toLowerCase()
  );

  if (exists) {
    return {
      success: false,
      message: "A todo with that title already exists.",
    };
  }

  setTodo([...todos, todo]);
  return { success: true, message: "Todo added successfully!" };
}

export function updateTodo(id: string, patch: UpdateTodoSchemaType) {
  const TodoSchemaTypes = getTodo();
  const idx = TodoSchemaTypes.findIndex((t) => t.id === id);
  if (idx === -1) return;
  TodoSchemaTypes[idx] = { ...TodoSchemaTypes[idx], ...patch };
  setTodo(TodoSchemaTypes);
}

export function deleteTodo(id: string) {
  const TodoSchemaTypes = getTodo().filter((t) => t.id !== id);
  setTodo(TodoSchemaTypes);
}

function nextDay(due?: Date) {
  const d = due ? new Date(due) : new Date();
  d.setDate(d.getDate() + 1);
  return d;
}

export function snoozeTodo(id: string) {
  const TodoSchemaTypes = getTodo();
  const idx = TodoSchemaTypes.findIndex((t) => t.id === id);
  if (idx === -1) return;
  const due = nextDay(TodoSchemaTypes[idx].due as Date | undefined);
  TodoSchemaTypes[idx] = { ...TodoSchemaTypes[idx], due };
  setTodo(TodoSchemaTypes);
}
