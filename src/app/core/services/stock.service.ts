import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Stock } from '../models/stock.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StockService implements OnDestroy {
  private ws!: WebSocket;
  private apiKey = environment.finnhubApiKey;
  private baseUrl = environment.finnhubBaseUrl;
  private stockSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA'];

  private stocksArraySubject = new BehaviorSubject<Stock[]>([]);
  public stocks$ = this.stocksArraySubject.asObservable();

  constructor(private http: HttpClient) {
    this.initStocks();
  }

  private async initStocks() {
    const stockArray: Stock[] = [];

    for (const symbol of this.stockSymbols) {
      const baseStock: Stock = {
        symbol,
        name: symbol,
        currentPrice: 0,
        highPrice: 0,
        lowPrice: 0,
        yearHigh: 0,
        yearLow: 0,
        timestamp: Date.now(),
        trend: 'same',
        active: true,
      };

      try {
        const [quote, profile]: any = await Promise.all([
          this.http
            .get(`${this.baseUrl}/quote?symbol=${symbol}&token=${this.apiKey}`)
            .toPromise(),
          this.http
            .get(
              `${this.baseUrl}/stock/profile2?symbol=${symbol}&token=${this.apiKey}`,
            )
            .toPromise(),
        ]);

        const updated: Stock = {
          ...baseStock,
          name: profile.name || symbol,
          currentPrice: quote.c,
          highPrice: quote.h,
          lowPrice: quote.l,
          yearHigh: quote.fh || quote.h,
          yearLow: quote.fl || quote.l,
          timestamp: Date.now(),
          trend: 'same',
          active: true,
        };

        stockArray.push(updated);
      } catch (e) {
        console.warn(`Failed to fetch static info for ${symbol}`, e);
        stockArray.push(baseStock);
      }
    }

    this.stocksArraySubject.next(stockArray);
    this.initWebSocket();
  }

  private initWebSocket() {
    this.ws = new WebSocket(
      `${environment.finnhubWebSocketUrl}?token=${this.apiKey}`,
    );

    this.ws.onopen = () => {
      this.stockSymbols.forEach((symbol) =>
        this.ws.send(JSON.stringify({ type: 'subscribe', symbol })),
      );
    };

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'trade' && msg.data) {
        const updatedStocks = [...this.stocksArraySubject.value];

        msg.data.forEach((trade: any) => {
          const { s: symbol, p: price, t: timestamp } = trade;

          const index = updatedStocks.findIndex((s) => s.symbol === symbol);
          if (index !== -1 && updatedStocks[index].active) {
            const prev = updatedStocks[index];
            const trend: Stock['trend'] =
              price > prev.currentPrice
                ? 'up'
                : price < prev.currentPrice
                  ? 'down'
                  : 'same';

            updatedStocks[index] = {
              ...prev,
              currentPrice: price,
              timestamp,
              trend: trend === 'same' ? prev.trend : trend,
            };
            this.stocksArraySubject.next(updatedStocks);
          }
        });
      }
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };
  }

  toggleStock(symbol: string, isActive: boolean): void {
    const updatedStocks = [...this.stocksArraySubject.value];
    const index = updatedStocks.findIndex((s) => s.symbol === symbol);
    if (index !== -1) {
      updatedStocks[index] = {
        ...updatedStocks[index],
        active: isActive,
      };
      this.stocksArraySubject.next(updatedStocks);
    }
  }

  ngOnDestroy(): void {
    if (this.ws) {
      this.stockSymbols.forEach((symbol) =>
        this.ws.send(JSON.stringify({ type: 'unsubscribe', symbol })),
      );
      this.ws.close();
    }
  }
}
