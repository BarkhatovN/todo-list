import { Component, Input, OnDestroy, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-time-left',
  standalone: true,
  imports: [CommonModule],
  template: '<span [class.expiring-soon]="isExpiringSoon">{{ timeLeftText }}</span>',
  styles: ['.expiring-soon { color: #f44336; font-weight: 500; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeLeftComponent implements OnInit, OnDestroy {
  @Input() expirationDate!: string;
  @Input() expirationTime?: string;

  timeLeftText = '';
  isExpiringSoon = false;
  private timer: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private startTimer() {
    this.updateTimeLeft();
    this.timer = setInterval(() => {
      this.updateTimeLeft();
      this.cdr.markForCheck();
    }, 1000);
  }

  private updateTimeLeft() {
    const now = new Date();
    const expiration = new Date(this.expirationDate);
    
    if (this.expirationTime) {
      const [hours, minutes] = this.expirationTime.split(':').map(Number);
      expiration.setHours(hours, minutes);
    }

    const diff = expiration.getTime() - now.getTime();
    const hours = Math.floor(diff / 3_600_000);
    const minutes = Math.floor((diff % 3_600_000) / 60_000);
    const seconds = Math.floor((diff % 60_000) / 1000);

    this.timeLeftText = `${hours}h ${minutes}m ${seconds}s left`;
    this.isExpiringSoon = diff <= 3_600_000; // 1 час в миллисекундах
  }
}