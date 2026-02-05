import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeetingRoomsComponent } from './meeting-rooms.component';

describe('MeetingRoomsComponent', () => {
  let component: MeetingRoomsComponent;
  let fixture: ComponentFixture<MeetingRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingRoomsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingRoomsComponent);
    component = fixture.componentInstance;
    component.roomsList = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize rooms signal', () => {
    expect(component.rooms()).toBeDefined();
    expect(Array.isArray(component.rooms())).toBeTruthy();
  });
});
