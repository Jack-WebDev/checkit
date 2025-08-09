"use client";

import { useEffect, useState } from "react";
import { TodoSchemaType } from "../schema";
import { STORE_KEY } from "../utils";
import AddTodo from "./addTodo";
import Header from "./Header";
import TodoList from "./TodoList";

export default function TodoApp() {
  const [todos, setTodos] = useState<TodoSchemaType[]>([]);

  useEffect(() => {
    const rawTodos = localStorage.getItem(STORE_KEY);
    setTodos(rawTodos ? JSON.parse(rawTodos) : []);
  }, []);

  return (
      <div className="container mx-auto px-4 py-6">
      <Header todoCount={todos.filter((t) => !t.completed).length} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="order-2 lg:order-1">
          <TodoList />
        </div>
        <div className="order-1 lg:order-2">
          <AddTodo />
        </div>
      </div>
    </div>
  );
}
