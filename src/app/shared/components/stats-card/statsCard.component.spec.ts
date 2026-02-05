import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatsCardComponent } from './statsCard.component';

describe('StatsCardComponent', () => {
  let component: StatsCardComponent;
  let fixture: ComponentFixture<StatsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsCardComponent);
    component = fixture.componentInstance;
    component.title = 'Test Title';
    component.value = 100;
    component.icon = 'test-icon';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept input properties', () => {
    expect(component.title).toBe('Test Title');
    expect(component.value).toBe(100);
    expect(component.icon).toBe('test-icon');
  });
});
