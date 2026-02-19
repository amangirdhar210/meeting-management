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
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should initialize with empty title', () => {
      expect(component.title).toBe('');
    });

    it('should initialize with empty value', () => {
      expect(component.value).toBe('');
    });

    it('should initialize with undefined icon', () => {
      expect(component.icon).toBeUndefined();
    });

    it('should accept string title input', () => {
      component.title = 'Total Rooms';
      expect(component.title).toBe('Total Rooms');
    });

    it('should accept number value input', () => {
      component.value = 42;
      expect(component.value).toBe(42);
    });

    it('should accept string value input', () => {
      component.value = '100+';
      expect(component.value).toBe('100+');
    });

    it('should accept icon input', () => {
      component.icon = 'pi pi-home';
      expect(component.icon).toBe('pi pi-home');
    });

    it('should handle zero as value', () => {
      component.value = 0;
      expect(component.value).toBe(0);
    });

    it('should handle negative numbers as value', () => {
      component.value = -5;
      expect(component.value).toBe(-5);
    });

    it('should handle large numbers as value', () => {
      component.value = 999999;
      expect(component.value).toBe(999999);
    });

    it('should handle special string values', () => {
      component.value = 'N/A';
      expect(component.value).toBe('N/A');
    });
  });

  describe('Output Events', () => {
    it('should have cardClick output emitter', () => {
      expect(component.cardClick).toBeDefined();
    });

    it('should emit cardClick event when onClick is called', () => {
      spyOn(component.cardClick, 'emit');
      
      component.onClick();
      
      expect(component.cardClick.emit).toHaveBeenCalled();
    });

    it('should emit event exactly once per click', () => {
      spyOn(component.cardClick, 'emit');
      
      component.onClick();
      
      expect(component.cardClick.emit).toHaveBeenCalledTimes(1);
    });

    it('should emit event without parameters', () => {
      spyOn(component.cardClick, 'emit');
      
      component.onClick();
      
      expect(component.cardClick.emit).toHaveBeenCalledWith();
    });
  });

  describe('Component Behavior', () => {
    it('should handle multiple clicks', () => {
      spyOn(component.cardClick, 'emit');
      
      component.onClick();
      component.onClick();
      component.onClick();
      
      expect(component.cardClick.emit).toHaveBeenCalledTimes(3);
    });

    it('should work with all properties set', () => {
      component.title = 'Active Users';
      component.value = 25;
      component.icon = 'pi pi-users';
      
      expect(component.title).toBe('Active Users');
      expect(component.value).toBe(25);
      expect(component.icon).toBe('pi pi-users');
    });

    it('should work with only required properties', () => {
      component.title = 'Count';
      component.value = 10;
      // icon is optional
      
      expect(component.title).toBe('Count');
      expect(component.value).toBe(10);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string title', () => {
      component.title = '';
      expect(component.title).toBe('');
    });

    it('should handle very long title', () => {
      const longTitle = 'A'.repeat(100);
      component.title = longTitle;
      expect(component.title.length).toBe(100);
    });

    it('should handle special characters in title', () => {
      component.title = 'Rooms & Spaces (2024)';
      expect(component.title).toBe('Rooms & Spaces (2024)');
    });

    it('should handle empty string value', () => {
      component.value = '';
      expect(component.value).toBe('');
    });

    it('should handle undefined icon gracefully', () => {
      component.icon = undefined;
      expect(component.icon).toBeUndefined();
    });

    it('should handle null-like values', () => {
      component.value = null as any;
      expect(component.value).toBeNull();
    });
  });

  describe('Integration Scenarios', () => {
    it('should support stats card for total rooms', () => {
      component.title = 'Total Rooms';
      component.value = 50;
      component.icon = 'pi pi-home';
      
      spyOn(component.cardClick, 'emit');
      component.onClick();
      
      expect(component.cardClick.emit).toHaveBeenCalled();
    });

    it('should support stats card for available rooms', () => {
      component.title = 'Available Rooms';
      component.value = 30;
      component.icon = 'pi pi-check-circle';
      
      spyOn(component.cardClick, 'emit');
      component.onClick();
      
      expect(component.cardClick.emit).toHaveBeenCalled();
    });

    it('should support stats card for total users', () => {
      component.title = 'Total Users';
      component.value = 120;
      component.icon = 'pi pi-users';
      
      spyOn(component.cardClick, 'emit');
      component.onClick();
      
      expect(component.cardClick.emit).toHaveBeenCalled();
    });

    it('should support stats card with string value like "100+"', () => {
      component.title = 'Bookings';
      component.value = '100+';
      component.icon = 'pi pi-calendar';
      
      expect(component.value).toBe('100+');
    });
  });
});
