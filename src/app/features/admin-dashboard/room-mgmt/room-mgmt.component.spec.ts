import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoomManagementComponent } from './room-mgmt.component';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

describe('RoomManagementComponent', () => {
  let component: RoomManagementComponent;
  let fixture: ComponentFixture<RoomManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomManagementComponent],
      providers: [
        provideHttpClient(),
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoomManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have UI constant', () => {
    expect(component.UI).toBeDefined();
  });

  it('should have BUTTONS constant', () => {
    expect(component.BUTTONS).toBeDefined();
  });

  it('should initialize rooms signal', () => {
    expect(component.rooms()).toBeDefined();
  });
});
