import { Component } from '@angular/core';
import { StocksComponent } from './features/stocks/stocks.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [StocksComponent, CommonModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'moneyBase';
}
