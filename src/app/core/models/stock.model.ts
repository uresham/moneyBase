export interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  highPrice: number;
  lowPrice: number;
  yearHigh: number;
  yearLow: number;
  timestamp: number;
  trend: 'up' | 'down' | 'same';
  active: boolean;
}
