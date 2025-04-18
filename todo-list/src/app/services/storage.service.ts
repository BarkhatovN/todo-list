import { Injectable } from '@angular/core';
import { JSONSchema, StorageMap } from '@ngx-pwa/local-storage';
import { Observable, delay, from, map } from 'rxjs';
import { Todo } from '../interfaces/todo.interface';
import { JSONSchemaArray } from '@ngx-pwa/local-storage/lib/validation/json-schema';


const todosJsonScheme: JSONSchemaArray = {
  items: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      createdAt: { type: 'string' },
      expirationDate: { type: 'string' },
      expirationTime: { type: 'string' },
      isFavorite: { type: 'boolean' },
      completed: { type: 'boolean' }
    },
    required: ['id', 'title', 'createdAt', 'expirationDate', 'isFavorite']
  },
  type: 'array',
  minItems: 0,
};

/**
 * Сервис для работы с локальным хранилищем.
 * Использует StorageMap из @ngx-pwa/local-storage для хранения данных.
 */

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'todos';
  private readonly DELAY = 300; // Имитация задержки сети

  constructor(private storage: StorageMap) { }

  getTodos(): Observable<Todo[]> {
    return this.storage.get<Todo[]>(this.STORAGE_KEY, todosJsonScheme).pipe(
      map(todos => todos || []),
      delay(300)
    );
  }

  setTodos(todos: Todo[]): Observable<void> {
    return from(this.storage.set(this.STORAGE_KEY, todos)).pipe(
      delay(this.DELAY)
    );
  }
}
