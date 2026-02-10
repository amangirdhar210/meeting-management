import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statsCard.component.html',
  styleUrls: ['./statsCard.component.scss'],
})
export class StatsCardComponent {
  @Input() title = '';
  @Input() value: string | number = '';
  @Input() icon?: string;
  @Output() cardClick = new EventEmitter<void>();

  onClick(): void {
    this.cardClick.emit();
  }
}
