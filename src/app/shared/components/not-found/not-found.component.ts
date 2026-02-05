import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES, BUTTON_LABELS } from '../../constants/app.constants';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  private router = inject(Router);
  
  readonly BUTTONS = BUTTON_LABELS;

  goToHome(): void {
    this.router.navigate([ROUTES.LOGIN]);
  }
}
