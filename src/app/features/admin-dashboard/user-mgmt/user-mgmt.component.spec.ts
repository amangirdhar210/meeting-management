import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserMgmtComponent } from './user-mgmt.component';
import { provideHttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';

describe('UserMgmtComponent', () => {
  let component: UserMgmtComponent;
  let fixture: ComponentFixture<UserMgmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMgmtComponent],
      providers: [
        provideHttpClient(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMgmtComponent);
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

  it('should initialize users signal', () => {
    expect(component.users()).toBeDefined();
  });

  it('should initialize filteredUsers signal', () => {
    expect(component.filteredUsers()).toBeDefined();
  });
});
