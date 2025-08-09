"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui";
import { CalendarIcon } from "lucide-react";
import {
  TodoPrioritySchema,
  TodoSchemaType,
  UpdateTodoSchema,
  UpdateTodoSchemaType,
} from "../schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@/components/ui/calendar";

type EditTodoProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  todo: TodoSchemaType | null;
  onSave: (values: UpdateTodoSchemaType) => void;
};

function reviveDue(d?: Date | string) {
  return d ? new Date(d) : undefined;
}

export default function EditTodo({
  open,
  onOpenChange,
  todo,
  onSave,
}: EditTodoProps) {
  const form = useForm<UpdateTodoSchemaType>({
    resolver: zodResolver(UpdateTodoSchema),
    defaultValues: todo
      ? {
          id: todo.id,
          title: todo.title,
          notes: todo.notes ?? "",
          priority: todo.priority,
          due: reviveDue(todo.due),
          completed: todo.completed ?? false,
          tags: todo.tags ?? [],
        }
      : undefined,
    values: todo
      ? {
          id: todo.id,
          title: todo.title,
          notes: todo.notes ?? "",
          priority: todo.priority,
          due: reviveDue(todo.due),
          completed: todo.completed ?? false,
          tags: todo.tags ?? [],
        }
      : undefined,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Todo</DialogTitle>
        </DialogHeader>

        <form
          id="edit-todo-form"
          onSubmit={form.handleSubmit((vals) => {
            onSave(vals);
            onOpenChange(false);
          })}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input {...form.register("title")} className="h-11 rounded-xl" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={form.watch("priority")}
                onValueChange={(v) => form.setValue("priority", v as any)}
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {TodoPrioritySchema.options.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Due date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 w-full justify-between rounded-xl"
                  >
                    {form.getValues("due")
                      ? format(form.getValues("due") as Date, "PPP")
                      : "Pick a date"}
                    <CalendarIcon className="h-4 w-4 opacity-60" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-2 rounded-xl">
                  <Calendar
                    mode="single"
                    selected={form.getValues("due") as Date | undefined}
                    onSelect={(d) => form.setValue("due", d)}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              {...form.register("notes")}
              className="min-h-24 rounded-xl resize-y"
            />
          </div>
        </form>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="ghost" className="rounded-xl">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="edit-todo-form" className="rounded-xl">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
