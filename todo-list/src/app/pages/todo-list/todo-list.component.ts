import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TodoGridComponent } from '../../components/todo-grid/todo-grid.component';
import { TodoService } from '../../services/todo.service';
import { Observable, debounceTime } from 'rxjs';
import { Todo } from '../../interfaces/todo.interface';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    TodoGridComponent
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent {
  todayTodos$: Observable<Todo[]>;
  futureTodos$: Observable<Todo[]>;
  favoriteTodos$: Observable<Todo[]>;
  isFavoriteRoute = false;

  constructor(
    private todoService: TodoService,
    private router: Router
  ) {
    this.isFavoriteRoute = this.router.url === '/favorite';
    this.todayTodos$ = this.todoService.getTodayTodos();
    this.futureTodos$ = this.todoService.getFutureTodos();
    this.favoriteTodos$ = this.todoService.getFavoriteTodos();
  }

  onAdd() {
    this.router.navigate(['/add']);
  }

  onToggleFavorite(id: string) {
    this.todoService.toggleFavorite(id)
      .pipe(debounceTime(300))
      .subscribe();
  }

  onToggleComplete(id: string) {
    this.todoService.toggleComplete(id)
      .pipe(debounceTime(300))
      .subscribe();
  }

  onRemove(id: string) {
    this.todoService.removeTodo(id).subscribe();
  }
}
