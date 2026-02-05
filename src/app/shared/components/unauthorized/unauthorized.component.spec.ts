import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnauthorizedComponent } from './unauthorized.component';
import { provideRouter } from '@angular/router';

describe('UnauthorizedComponent', () => {
  let component: UnauthorizedComponent;
  let fixture: ComponentFixture<UnauthorizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnauthorizedComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UnauthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have BUTTONS constant', () => {
    expect(component.BUTTONS).toBeDefined();
  });

  it('should navigate to login when goToLogin is called', () => {
    spyOn(component['router'], 'navigate');
    component.goToLogin();
    expect(component['router'].navigate).toHaveBeenCalled();
  });
});
