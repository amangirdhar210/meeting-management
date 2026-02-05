import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoomScheduleModalComponent } from './room-schedule-modal.component';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Room } from '../../../shared/models/room.model';

describe('RoomScheduleModalComponent', () => {
  let component: RoomScheduleModalComponent;
  let fixture: ComponentFixture<RoomScheduleModalComponent>;
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
      imports: [RoomScheduleModalComponent],
      providers: [
        provideHttpClient(),
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoomScheduleModalComponent);
    component = fixture.componentInstance;
    component.roomId = mockRoom.id;
    component.roomName = mockRoom.name;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept roomId and roomName inputs', () => {
    expect(component.roomId).toBe('1');
    expect(component.roomName).toBe('Test Room');
  });

  it('should have UI constant', () => {
    expect(component.UI).toBeDefined();
  });

  it('should have ROOM_STATUS constant', () => {
    expect(component.ROOM_STATUS).toBeDefined();
  });
});
