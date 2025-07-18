import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Stock } from '../../core/models/stock.model';
import { StockService } from '../../core/services/stock.service';
import { StockCardComponent } from './components/stock-card/stock-card.component';

import { MatGridListModule } from '@angular/material/grid-list';
@Component({
  selector: 'app-stocks',
  imports: [CommonModule, StockCardComponent, MatGridListModule],
  standalone: true,
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.scss',
})
export class StocksComponent implements OnInit, OnDestroy {
  stocks$!: Observable<Stock[]>;
  isDesktop = signal(window.innerWidth > 600);
  breakpoint = signal(1);
  private resizeListener = () => {
    this.isDesktop.set(window.innerWidth > 600);
  };

  constructor(private stockService: StockService) {
    this.stocks$ = this.stockService.stocks$;
  }

  ngOnInit() {
    window.addEventListener('resize', this.resizeListener);
    this.breakpoint.set(window.innerWidth <= 400 ? 1 : 4);
  }

  onResize(event: any) {
    this.breakpoint.set(event.target.innerWidth <= 400 ? 1 : 4);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
  }

  onToggleStock(event: { symbol: string; isActive: boolean }) {
    this.stockService.toggleStock(event.symbol, event.isActive);
  }
}
