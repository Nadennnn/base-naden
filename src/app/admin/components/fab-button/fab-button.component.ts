import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-fab-button',
  templateUrl: './fab-button.component.html',
  styleUrls: ['./fab-button.component.scss'],
  standalone: false,
})
export class FabButtonComponent {
  @Output() onClick = new EventEmitter<void>();
}
