"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useMemo, useState } from "react";
import {
  TodoPrioritySchemaType,
  TodoSchemaType,
  UpdateTodoSchemaType,
} from "../schema";
import {
  deleteTodo,
  getTodo,
  setTodo,
  snoozeTodo,
  updateTodo,
} from "@/lib/local-store";
import {
  BellOff,
  CalendarIcon,
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import EditTodo from "./EditTodo";
import { createdTs } from "../utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

export default function TodoList() {
  const [todos, setTodos] = useState<TodoSchemaType[]>([]);
  const [editing, setEditing] = useState<TodoSchemaType | null>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState<TodoPrioritySchemaType | string>(
    "all"
  );
  const [q, setQ] = useState("");

  useEffect(() => {
    setTodos(getTodo());

    const onStorage = (e: StorageEvent) => {
      if (e.key === "todos") setTodos(getTodo());
    };
    const onLocal = () => setTodos(getTodo());

    window.addEventListener("storage", onStorage);
    window.addEventListener("todos:update", onLocal as any);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("todos:update", onLocal as any);
    };
  }, []);

  const priorityColor: Record<string, string> = {
    low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    medium:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    high: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return todos.filter((t) => {
      if (status === "active" && t.completed) return false;
      if (status === "completed" && !t.completed) return false;
      if (priority !== "all" && t.priority !== priority) return false;
      if (term) {
        const hay = [t.title, t.notes, ...(t.tags ?? []), t.priority]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [todos, status, priority, q]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const ac = a.completed ? 1 : 0;
      const bc = b.completed ? 1 : 0;
      if (ac !== bc) return ac - bc;
      return createdTs(b) - createdTs(a);
    });
  }, [filtered]);

  const activeCount = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos]
  );
  const completedCount = useMemo(
    () => todos.filter((t) => !!t.completed).length,
    [todos]
  );

  const toggleComplete = (t: TodoSchemaType, next: boolean) => {
    updateTodo(t.id, { completed: next } as UpdateTodoSchemaType);
    setTodos(getTodo());
  };
  const handleSnooze = (id: string) => {
    snoozeTodo(id);
    setTodos(getTodo());
  };
  const handleDelete = (id: string) => {
    deleteTodo(id);
    setTodos(getTodo());
  };
  const handleEdit = (t: TodoSchemaType) => {
    setEditing(t);
    setOpen(true);
  };
  const handleSave = (patch: UpdateTodoSchemaType) => {
    updateTodo(patch.id, patch);
    setTodos(getTodo());
  };

  const clearCompleted = () => {
    const next = todos.filter((t) => !t.completed);
    setTodo(next);
    location.reload();
  };
  const clearActive = () => {
    const next = todos.filter((t) => t.completed);
    setTodo(next);
    location.reload();
  };
  const clearAll = () => {
    setTodo([]);
    location.reload();
  };

  return (
    <section className="w-full">
      <div className="mb-4 flex flex-col gap-3 sm:gap-4  md:items-end md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 md:gap-4">
          <Tabs
            value={status}
            onValueChange={(v) => setStatus(v)}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-3 sm:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="min-w-[170px]">
            <Select
              value={priority}
              onValueChange={(v) => setPriority(v as TodoPrioritySchemaType)}
            >
              <SelectTrigger className="h-10 w-full rounded-xl">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All priorities</SelectItem>
                {(["high", "medium", "low"] as const).map((p) => (
                  <SelectItem key={p} value={p} className="capitalize">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-64">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, notes, tags…"
              className="h-10 rounded-xl"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={clearCompleted}
            disabled={!completedCount}
          >
            Clear Completed
          </Button>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={clearActive}
            disabled={!activeCount}
          >
            Clear Active
          </Button>
          <Button
            variant="destructive"
            className="rounded-xl"
            onClick={clearAll}
            disabled={!todos.length}
          >
            Clear All
          </Button>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Your Todos</h2>
        <span className="text-sm text-muted-foreground">
          {sorted.length} item{sorted.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="grid gap-4 sm:gap-5 overflow-y-auto max-h-[70vh] pr-1">
        {sorted.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="p-6 text-muted-foreground">
              Nothing matches your filters — try clearing them or add a new
              todo!
            </CardContent>
          </Card>
        ) : (
          sorted.map((t) => (
            <Card
              key={t.id}
              className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur shadow-sm "
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={!!t.completed}
                      onCheckedChange={(v) => toggleComplete(t, !!v)}
                      className="mt-1"
                      aria-label={`Mark ${t.title} as ${
                        t.completed ? "incomplete" : "complete"
                      }`}
                    />
                    <div>
                      <CardTitle className="text-base sm:text-lg">
                        <span
                          className={
                            t.completed
                              ? "line-through text-muted-foreground"
                              : ""
                          }
                        >
                          {t.title}
                        </span>
                      </CardTitle>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Badge
                          className={`capitalize ${
                            priorityColor[t.priority] || ""
                          }`}
                        >
                          {t.priority}
                        </Badge>
                        {t.due && (
                          <Badge variant="outline" className="gap-1">
                            <CalendarIcon className="h-3.5 w-3.5" />
                            {format(new Date(t.due), "PPP")}
                          </Badge>
                        )}
                        {t.tags?.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="rounded-full"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem onClick={() => handleEdit(t)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSnooze(t.id)}>
                        <BellOff className="mr-2 h-4 w-4" /> Snooze 1 day
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(t.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              {t.notes && (
                <CardContent className="pt-0 pb-5 px-5">
                  <p className="text-sm text-muted-foreground">{t.notes}</p>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      <EditTodo
        open={open}
        onOpenChange={setOpen}
        todo={editing}
        onSave={handleSave}
      />
    </section>
  );
}
