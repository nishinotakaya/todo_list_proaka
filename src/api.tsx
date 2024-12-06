// src/api.ts
import type { Todo } from './types'; // type-only import で型をインポート

// 共通のヘッダー設定を作成
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : '',
  };
};

export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch("http://localhost:3031/api/v1/todos", {
    headers: getHeaders(),
    credentials: 'include', // Cookieを含める
  });
  return response.json();
};

export const createTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  const response = await fetch("http://localhost:3031/api/v1/todos", {
    method: "POST",
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(todo),
  });
  return response.json();
};

export const updateTodo = async (id: number, updatedTodo: Partial<Todo>): Promise<Todo> => {
  const response = await fetch(`http://localhost:3031/api/v1/todos/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(updatedTodo),
  });
  return response.json();
};

export const deleteTodo = async (id: number): Promise<void> => {
  await fetch(`http://localhost:3031/api/v1/todos/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
    credentials: 'include',
  });
};
