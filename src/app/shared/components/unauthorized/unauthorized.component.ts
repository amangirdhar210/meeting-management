import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES, BUTTON_LABELS } from '../../constants/app.constants';

@Component({
  selector: 'app-unauthorized',
  imports: [],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss',
})
export class UnauthorizedComponent {
  private router = inject(Router);
  
  readonly BUTTONS = BUTTON_LABELS;

  goToLogin(): void {
    this.router.navigate([ROUTES.LOGIN]);
  }
}
