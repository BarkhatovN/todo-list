import { Routes } from '@angular/router';
import { TodoListComponent } from './pages/todo-list/todo-list.component';
import { AddTodoComponent } from './pages/add-todo/add-todo.component';

export const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: TodoListComponent },
  { path: 'add', component: AddTodoComponent },
  { path: 'favorite', component: TodoListComponent },
  { path: '**', redirectTo: 'list' }
];
