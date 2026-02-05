import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoomSearchComponent } from './room-search.component';

describe('RoomSearchComponent', () => {
  let component: RoomSearchComponent;
  let fixture: ComponentFixture<RoomSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoomSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize search form', () => {
    expect(component.searchForm).toBeDefined();
  });

  it('should have BUTTONS constant', () => {
    expect(component.BUTTONS).toBeDefined();
  });

  it('should have LABELS constant', () => {
    expect(component.LABELS).toBeDefined();
  });

  it('should have search output emitter', () => {
    expect(component.search).toBeDefined();
  });

  it('should initialize showFilters signal', () => {
    expect(component.showFilters()).toBeDefined();
  });

  it('should initialize capacityRange signal', () => {
    expect(component.capacityRange()).toBeDefined();
  });
});
