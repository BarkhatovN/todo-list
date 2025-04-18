import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { TimeLeftComponent } from '../time-left/time-left.component';
import { Todo } from '../../interfaces/todo.interface';

@Component({
  selector: 'app-todo-grid',
  templateUrl: './todo-grid.component.html',
  styleUrls: ['./todo-grid.component.scss'],
  standalone: true,
  imports: [
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
    TimeLeftComponent
  ]
})
export class TodoGridComponent {
  @Input() todos: Todo[] = [];
  @Input() showTimeLeft = false;

  @Output() onToggleComplete = new EventEmitter<string>();
  @Output() onToggleFavorite = new EventEmitter<string>();
  @Output() onRemove = new EventEmitter<string>();
}
