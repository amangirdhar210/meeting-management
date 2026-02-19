import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeetingRoomComponent } from './meeting-room.component';
import { Room } from '../../../shared/models/room.model';

describe('MeetingRoomComponent', () => {
  let component: MeetingRoomComponent;
  let fixture: ComponentFixture<MeetingRoomComponent>;
  let mockRoom: Room;

  beforeEach(async () => {
    mockRoom = {
      id: 'room-123',
      name: 'Conference Room A',
      room_number: 101,
      capacity: 10,
      floor: 1,
      amenities: ['Projector', 'Whiteboard', 'Video Conference'],
      location: 'Building A',
      description: 'Large conference room with modern amenities',
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

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should accept roomData input', () => {
      expect(component.roomData).toBeDefined();
      expect(component.roomData.name).toBe('Conference Room A');
    });

    it('should have required roomData property', () => {
      expect(component.roomData).toEqual(mockRoom);
    });

    it('should access room properties correctly', () => {
      expect(component.roomData.id).toBe('room-123');
      expect(component.roomData.room_number).toBe(101);
      expect(component.roomData.capacity).toBe(10);
      expect(component.roomData.floor).toBe(1);
      expect(component.roomData.location).toBe('Building A');
      expect(component.roomData.status).toBe('available');
    });

    it('should handle room with amenities array', () => {
      expect(component.roomData.amenities).toEqual(['Projector', 'Whiteboard', 'Video Conference']);
      expect(component.roomData.amenities.length).toBe(3);
    });

    it('should handle room with description', () => {
      expect(component.roomData.description).toBe('Large conference room with modern amenities');
    });
  });

  describe('Signal State Management', () => {
    it('should initialize isBooking signal as false', () => {
      expect(component.isBooking()).toBeFalse();
    });

    it('should initialize isViewingSchedule signal as false', () => {
      expect(component.isViewingSchedule()).toBeFalse();
    });

    it('should compute currentStatus from roomData', () => {
      expect(component.currentStatus()).toBe('available');
    });

    it('should update currentStatus when room status changes', () => {
      mockRoom.status = 'maintenance';
      fixture.detectChanges();
      
      expect(component.currentStatus()).toBe('maintenance');
    });
  });

  describe('Booking Functionality', () => {
    it('should set isBooking to true when startBooking is called', () => {
      component.startBooking();
      
      expect(component.isBooking()).toBeTrue();
    });

    it('should set isBooking to false when cancelBooking is called', () => {
      component.startBooking();
      expect(component.isBooking()).toBeTrue();
      
      component.cancelBooking();
      
      expect(component.isBooking()).toBeFalse();
    });

    it('should toggle isBooking state', () => {
      expect(component.isBooking()).toBeFalse();
      
      component.startBooking();
      expect(component.isBooking()).toBeTrue();
      
      component.cancelBooking();
      expect(component.isBooking()).toBeFalse();
      
      component.startBooking();
      expect(component.isBooking()).toBeTrue();
    });

    it('should handle multiple startBooking calls', () => {
      component.startBooking();
      component.startBooking();
      component.startBooking();
      
      expect(component.isBooking()).toBeTrue();
    });

    it('should handle multiple cancelBooking calls', () => {
      component.startBooking();
      component.cancelBooking();
      component.cancelBooking();
      
      expect(component.isBooking()).toBeFalse();
    });
  });

  describe('Schedule Viewing Functionality', () => {
    it('should set isViewingSchedule to true when viewSchedule is called', () => {
      component.viewSchedule();
      
      expect(component.isViewingSchedule()).toBeTrue();
    });

    it('should set isViewingSchedule to false when closeSchedule is called', () => {
      component.viewSchedule();
      expect(component.isViewingSchedule()).toBeTrue();
      
      component.closeSchedule();
      
      expect(component.isViewingSchedule()).toBeFalse();
    });

    it('should toggle isViewingSchedule state', () => {
      expect(component.isViewingSchedule()).toBeFalse();
      
      component.viewSchedule();
      expect(component.isViewingSchedule()).toBeTrue();
      
      component.closeSchedule();
      expect(component.isViewingSchedule()).toBeFalse();
    });

    it('should handle multiple viewSchedule calls', () => {
      component.viewSchedule();
      component.viewSchedule();
      component.viewSchedule();
      
      expect(component.isViewingSchedule()).toBeTrue();
    });

    it('should handle multiple closeSchedule calls', () => {
      component.viewSchedule();
      component.closeSchedule();
      component.closeSchedule();
      
      expect(component.isViewingSchedule()).toBeFalse();
    });
  });

  describe('Independent State Management', () => {
    it('should manage booking and schedule states independently', () => {
      component.startBooking();
      component.viewSchedule();
      
      expect(component.isBooking()).toBeTrue();
      expect(component.isViewingSchedule()).toBeTrue();
    });

    it('should allow closing booking without affecting schedule state', () => {
      component.startBooking();
      component.viewSchedule();
      
      component.cancelBooking();
      
      expect(component.isBooking()).toBeFalse();
      expect(component.isViewingSchedule()).toBeTrue();
    });

    it('should allow closing schedule without affecting booking state', () => {
      component.startBooking();
      component.viewSchedule();
      
      component.closeSchedule();
      
      expect(component.isBooking()).toBeTrue();
      expect(component.isViewingSchedule()).toBeFalse();
    });
  });

  describe('Room Status Variations', () => {
    it('should handle available room status', () => {
      component.roomData = { ...mockRoom, status: 'available' };
      expect(component.currentStatus()).toBe('available');
    });

    it('should handle unavailable room status', () => {
      component.roomData = { ...mockRoom, status: 'unavailable' };
      expect(component.currentStatus()).toBe('unavailable');
    });

    it('should handle maintenance room status', () => {
      component.roomData = { ...mockRoom, status: 'maintenance' };
      expect(component.currentStatus()).toBe('maintenance');
    });
  });

  describe('Constants', () => {
    it('should have BUTTONS constant defined', () => {
      expect(component.BUTTONS).toBeDefined();
    });

    it('should have UI constant defined', () => {
      expect(component.UI).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle room with empty amenities array', () => {
      component.roomData = { ...mockRoom, amenities: [] };
      expect(component.roomData.amenities.length).toBe(0);
    });

    it('should handle room with no description', () => {
      component.roomData = { ...mockRoom, description: undefined };
      expect(component.roomData.description).toBeUndefined();
    });

    it('should handle room with single amenity', () => {
      component.roomData = { ...mockRoom, amenities: ['Projector'] };
      expect(component.roomData.amenities.length).toBe(1);
    });

    it('should handle room with many amenities', () => {
      const manyAmenities = Array.from({ length: 10 }, (_, i) => `Amenity ${i + 1}`);
      component.roomData = { ...mockRoom, amenities: manyAmenities };
      expect(component.roomData.amenities.length).toBe(10);
    });

    it('should handle room with zero capacity', () => {
      component.roomData = { ...mockRoom, capacity: 0 };
      expect(component.roomData.capacity).toBe(0);
    });

    it('should handle room with large capacity', () => {
      component.roomData = { ...mockRoom, capacity: 500 };
      expect(component.roomData.capacity).toBe(500);
    });
  });

  describe('Integration Scenarios', () => {
    it('should support complete booking workflow', () => {
      // Start booking
      component.startBooking();
      expect(component.isBooking()).toBeTrue();
      
      // Cancel booking
      component.cancelBooking();
      expect(component.isBooking()).toBeFalse();
    });

    it('should support viewing and closing schedule', () => {
      // View schedule
      component.viewSchedule();
      expect(component.isViewingSchedule()).toBeTrue();
      
      // Close schedule
      component.closeSchedule();
      expect(component.isViewingSchedule()).toBeFalse();
    });

    it('should support simultaneous booking and schedule viewing', () => {
      component.startBooking();
      component.viewSchedule();
      
      expect(component.isBooking()).toBeTrue();
      expect(component.isViewingSchedule()).toBeTrue();
      
      component.cancelBooking();
      component.closeSchedule();
      
      expect(component.isBooking()).toBeFalse();
      expect(component.isViewingSchedule()).toBeFalse();
    });
  });
});
