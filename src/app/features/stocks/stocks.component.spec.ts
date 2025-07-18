import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StocksComponent } from './stocks.component';
import { StockService } from '../../core/services/stock.service';
import { of } from 'rxjs';

describe('StocksComponent', () => {
  let component: StocksComponent;
  let fixture: ComponentFixture<StocksComponent>;
  let stockServiceMock: any;

  beforeEach(async () => {
    stockServiceMock = {
      stocks$: of([]),
      toggleStock: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [StocksComponent],
      providers: [{ provide: StockService, useValue: stockServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(StocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
