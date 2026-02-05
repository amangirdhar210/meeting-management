import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeetingRoomComponent } from './meeting-room.component';
import { Room } from '../../../shared/models/room.model';

describe('MeetingRoomComponent', () => {
  let component: MeetingRoomComponent;
  let fixture: ComponentFixture<MeetingRoomComponent>;
  let mockRoom: Room;

  beforeEach(async () => {
    mockRoom = {
      id: '1',
      name: 'Test Room',
      room_number: 101,
      capacity: 10,
      floor: 1,
      amenities: ['Projector'],
      location: 'Building A',
      description: 'Test Description',
      status: 'available',
    };

    await TestBed.configureTestingModule({
      imports: [MeetingRoomComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingRoomComponent);
    component = fixture.componentInstance;
    component.roomData = mockRoom;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept roomData input', () => {
    expect(component.roomData).toBeDefined();
    expect(component.roomData.name).toBe('Test Room');
  });

  it('should have BUTTONS constant', () => {
    expect(component.BUTTONS).toBeDefined();
  });

  it('should have UI constant', () => {
    expect(component.UI).toBeDefined();
  });
});
