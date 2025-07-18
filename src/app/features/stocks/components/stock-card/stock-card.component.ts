import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { Stock } from '../../../../core/models/stock.model';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stock-card',
  templateUrl: './stock-card.component.html',
  styleUrl: './stock-card.component.scss',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatSlideToggleModule,
    CommonModule,
    MatIconModule,
  ],
})
export class StockCardComponent {
  @Input() stock!: Stock;
  @Input() isDesktop = false;
  @Output() toggle = new EventEmitter<{ symbol: string; isActive: boolean }>();

  get cardColor(): string {
    if (!this.stock.active) return 'grey';
    if (this.stock.trend === 'up') return 'green';
    if (this.stock.trend === 'down') return 'red';
    return 'white';
  }

  onToggle(event: MatSlideToggleChange) {
    const checked = event.checked;
    this.toggle.emit({ symbol: this.stock.symbol, isActive: checked });
  }
}
