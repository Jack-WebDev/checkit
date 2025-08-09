"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import cuid from "cuid";

import { TodoPrioritySchema } from "../schema";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { TagInput } from "./AddTag";
import { addTodo } from "@/lib/local-store";

const todoFormSchema = z.object({
  title: z.string().min(2).max(50),
  completed: z.boolean(),
  due: z.date().optional(),
  priority: TodoPrioritySchema,
  notes: z.string().optional(),
  tags: z.array(z.string()),
});

export default function AddTodo() {
  const form = useForm<z.infer<typeof todoFormSchema>>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      title: "",
      completed: false,
      due: undefined,
      priority: TodoPrioritySchema.enum.medium,
      notes: "",
      tags: [],
    },
  });

  async function onSubmit(values: z.infer<typeof todoFormSchema>) {
    const createTodoData = {
      id: cuid(),
      title: values.title,
      completed: values.completed,
      due: values.due,
      priority: values.priority,
      notes: values.notes,
      tags: values.tags,
      createdAt: new Date(),
    };

    try {
      const res = addTodo(createTodoData);

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success("Todo added successfully!");
        form.reset();

        setTimeout(() => {
          location.reload();
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-[70vh] w-full bg-gradient-to-b from-background via-muted/30 to-background py-10 px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-full max-w-3xl rounded-2xl border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60
                   shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-1 ring-border p-6 md:p-8"
        >
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
              Create a Todo
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add a title, due date, priority, and a few tags. Keep it short &
              sweet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Enter Todo Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Ship v1 status update"
                      autoComplete="off"
                      className="h-11 rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="due"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-sm">Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="h-11 w-full justify-between rounded-xl pl-3 pr-3 font-normal"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-2 h-4 w-4 opacity-60" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-auto p-2 rounded-xl"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                        className="rounded-lg"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-destructive text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm">Todo Priority</FormLabel>

                  <div className="w-full">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 w-full rounded-xl">
                          <SelectValue placeholder="Select a priority" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent
                        position="popper"
                        className="w-[--radix-select-trigger-width] min-w-0 rounded-lg"
                      >
                        {TodoPrioritySchema.options.map((priority) => (
                          <SelectItem
                            key={priority}
                            value={priority}
                            className="cursor-pointer"
                          >
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <FormMessage className="text-destructive text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Add Todo Tags</FormLabel>
                  <FormControl>
                    <TagInput
                      value={field.value ?? []}
                      onChange={field.onChange}
                      placeholder="Type and press Enter or comma"
                      maxTags={12}
                    />
                  </FormControl>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Tip: separate tags with commas
                  </p>
                  <FormMessage className="text-destructive text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-5 md:mt-6">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Todo Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any extra context or steps…"
                      className="min-h-28 rounded-xl resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl hover:bg-muted/60"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="rounded-xl h-11 px-5 font-medium transition
                       hover:scale-[1.01] active:scale-[0.99]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
