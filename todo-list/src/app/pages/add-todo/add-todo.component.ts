import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, NonNullableFormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { CustomErrorStateMatcher } from '../../utils/custom-error-matcher';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    NgxMaterialTimepickerModule
  ],
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss']
})
export class AddTodoComponent {
  todoForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    expirationDate: [new Date(), [Validators.required, this.futureDateValidator()]],
    expirationTime: ['', [this.futureTimeValidator()]]
  }, { validators: this.dateTimeValidator() });
  submitted = false;
  isSubmitting = false;
  errorStateMatcher = new CustomErrorStateMatcher(this.submitted);

  constructor(
    private fb: NonNullableFormBuilder,
    private todoService: TodoService,
    private router: Router
  ) {
  }

  private futureDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(control.value);
      inputDate.setHours(0, 0, 0, 0);
      return inputDate.getTime() >= today.getTime() ? null : { pastDate: true };
    };
  }

  private convertTo24Hour(timeStr: string): { hours: number, minutes: number } {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier.toUpperCase() === 'PM' && hours < 12) {
      hours = hours + 12;
    }
    if (modifier.toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
    }

    return { hours, minutes };
  }

  private futureTimeValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const parent = control.parent;
      if (!parent) return null;

      const dateControl = parent.get('expirationDate');
      if (!dateControl || !dateControl.value) return null;

      const today = new Date();
      const selectedDate = new Date(dateControl.value);

      // Проверяем время только если дата - сегодня
      if (selectedDate.getDate() !== today.getDate() ||
        selectedDate.getMonth() !== today.getMonth() ||
        selectedDate.getFullYear() !== today.getFullYear()) {
        return null;
      }

      const { hours, minutes } = this.convertTo24Hour(control.value);
      const selectedTime = new Date();
      selectedTime.setHours(hours, minutes, 0, 0);

      const currentTime = new Date();
      currentTime.setSeconds(0, 0);

      return selectedTime.getTime() > currentTime.getTime() ? null : { pastTime: true };
    };
  }

  private dateTimeValidator() {
    return (group: AbstractControl): ValidationErrors | null => {
      const date = group.get('expirationDate');
      const time = group.get('expirationTime');

      if (!date || !time || !date.value) return null;

      const today = new Date();
      const selectedDate = new Date(date.value);

      // Если дата сегодня и время не указано
      if (selectedDate.getDate() === today.getDate() &&
        selectedDate.getMonth() === today.getMonth() &&
        selectedDate.getFullYear() === today.getFullYear() &&
        !time.value) {
        return { requireTime: true };
      }

      return null;
    };
  }

  onSubmit() {
    this.submitted = true;
    if (this.todoForm.valid) {
      this.isSubmitting = true;
      const formValues = this.todoForm.value;
      const expirationTime = formValues.expirationTime ? this.convertTo24Hour(formValues.expirationTime) : '';
      const todoData = {
        title: formValues.title!,
        expirationDate: formValues.expirationDate!.toISOString(),
        expirationTime: expirationTime ? `${expirationTime.hours}:${expirationTime.minutes}` : ''
      };

      this.todoService.addTodo(todoData).pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      ).subscribe(
        () => this.router.navigate(['/list'])
      );
    }
  }

  onBack() {
    this.router.navigate(['/list']);
  }

  getHoursAndMinutes(timeStr: string): string {
    const [time, modifier] = timeStr.trim().split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier.toUpperCase() === 'PM' && hours !== 12) {
      hours += 12;
    } else if (modifier.toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${hours}:${minutes}`;
  }

  get title() { return this.todoForm.get('title'); }
  get expirationDate() { return this.todoForm.get('expirationDate'); }
  get expirationTime() { return this.todoForm.get('expirationTime'); }
}
