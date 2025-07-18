import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockCardComponent } from './stock-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule, MatSlideToggle } from '@angular/material/slide-toggle';
import { By } from '@angular/platform-browser';

describe('StockCardComponent', () => {
  let component: StockCardComponent;
  let fixture: ComponentFixture<StockCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockCardComponent, MatCardModule, MatSlideToggleModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StockCardComponent);
    component = fixture.componentInstance;
    component.stock = {
      symbol: 'AAPL',
      name: 'Apple',
      currentPrice: 100,
      highPrice: 110,
      lowPrice: 90,
      yearHigh: 120,
      yearLow: 80,
      timestamp: Date.now(),
      trend: 'same',
      active: true,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display stock name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Apple');
  });

  it('should return green for cardColor when trend is up and active', () => {
    component.stock.trend = 'up';
    component.stock.active = true;
    expect(component.cardColor).toBe('green');
  });

  it('should return red for cardColor when trend is down and active', () => {
    component.stock.trend = 'down';
    component.stock.active = true;
    expect(component.cardColor).toBe('red');
  });

  it('should return grey for cardColor when not active', () => {
    component.stock.active = false;
    expect(component.cardColor).toBe('grey');
  });

  it('should return white for cardColor when trend is same and active', () => {
    component.stock.trend = 'same';
    component.stock.active = true;
    expect(component.cardColor).toBe('white');
  });

  it('should emit toggle event when slide toggle is changed', () => {
    jest.spyOn(component.toggle, 'emit');
    const componentDebug = fixture.debugElement;
    const slider = componentDebug.query(By.directive(MatSlideToggle));
    slider.triggerEventHandler('change',  { checked: false });
    expect(component.toggle.emit).toHaveBeenCalledWith({ symbol: 'AAPL', isActive: false });
  });
});
