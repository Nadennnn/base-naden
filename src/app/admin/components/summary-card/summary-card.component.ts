import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss'],
  standalone: false,
})
export class SummaryCardComponent {
  @Input() label: string = '';
  @Input() value: number = 0;
  @Input() icon: string = '';
  @Input() iconBg: string = 'bg-indigo-500/20';
  @Input() iconColor: string = 'text-indigo-400';
  @Input() subtitle: string = '';
  @Input() subtitleColor: string = 'text-gray-400';
}
