import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUserFormComponent } from './add-user-form.component';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

describe('AddUserFormComponent', () => {
  let component: AddUserFormComponent;
  let fixture: ComponentFixture<AddUserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUserFormComponent],
      providers: [
        provideHttpClient(),
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user form', () => {
    expect(component.addUserForm).toBeDefined();
  });

  it('should have cancelAdd output emitter', () => {
    expect(component.cancelAdd).toBeDefined();
  });
});
