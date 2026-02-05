import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddRoomFormComponent } from './add-room-form.component';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

describe('AddRoomFormComponent', () => {
  let component: AddRoomFormComponent;
  let fixture: ComponentFixture<AddRoomFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRoomFormComponent],
      providers: [
        provideHttpClient(),
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddRoomFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have isSubmitting property', () => {
    expect(component.isSubmitting).toBeDefined();
  });

  it('should have cancelAdd output emitter', () => {
    expect(component.cancelAdd).toBeDefined();
  });
});
