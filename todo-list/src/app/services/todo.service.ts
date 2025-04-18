import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Todo } from '../interfaces/todo.interface';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos$ = new BehaviorSubject<Todo[]>([]);

  constructor(private storageService: StorageService) {
    this.loadTodos();
  }

  private loadTodos(): void {
    this.storageService.getTodos().subscribe(todos => {
      this.todos$.next(todos || []);
    });
  }

  getTodos(): Observable<Todo[]> {
    return this.todos$.asObservable();
  }

  getTodayTodos(): Observable<Todo[]> {
    return this.todos$.pipe(
      map(todos => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        return todos.filter(todo => {
          const todoDate = new Date(todo.expirationDate);
          todoDate.setHours(0, 0, 0, 0);
          return todoDate.getTime() === today.getTime();
        });
      })
    );
  }

  getFutureTodos(): Observable<Todo[]> {
    return this.todos$.pipe(
      map(todos => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return todos.filter(todo => {
          const todoDate = new Date(todo.expirationDate);
          todoDate.setHours(0, 0, 0, 0);
          return todoDate.getTime() > today.getTime();
        });
      })
    );
  }

  getFavoriteTodos(): Observable<Todo[]> {
    return this.todos$.pipe(
      map(todos => todos.filter(todo => todo.isFavorite))
    );
  }

  addTodo(todo: Omit<Todo, 'id' | 'createdAt' | 'isFavorite' | 'completed'>): Observable<void> {
    const newTodo: Todo = {
      ...todo,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      isFavorite: false,
      completed: false
    };

    const updatedTodos = [...this.todos$.value, newTodo];
    this.todos$.next(updatedTodos);
    return this.storageService.setTodos(updatedTodos);
  }

  toggleFavorite(id: string): Observable<void> {
    const updatedTodos = this.todos$.value.map(todo =>
      todo.id === id ? { ...todo, isFavorite: !todo.isFavorite } : todo
    );
    
    this.todos$.next(updatedTodos);
    return this.storageService.setTodos(updatedTodos);
  }

  toggleComplete(id: string): Observable<void> {
    const updatedTodos = this.todos$.value.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    
    this.todos$.next(updatedTodos);
    return this.storageService.setTodos(updatedTodos);
  }

  removeTodo(id: string): Observable<void> {
    const updatedTodos = this.todos$.value.filter(todo => todo.id !== id);
    
    this.todos$.next(updatedTodos);
    return this.storageService.setTodos(updatedTodos);
  }
}
