import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLoginFormComponent } from '../login/login.component';
import { FetchApiDataService } from '../services/fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
  imports: [UserLoginFormComponent, CommonModule],
})
export class WelcomePageComponent {
  isLoginModalOpen = false;
  isRegistrationModalOpen = false;

  constructor(
    private fetchApiData: FetchApiDataService,
    private router: Router
  ) {}

  openLoginModal(): void {
    this.isLoginModalOpen = true;
  }

  openRegistrationModal(): void {
    this.isRegistrationModalOpen = true;
  }

  closeModal(): void {
    this.isLoginModalOpen = false;
    this.isRegistrationModalOpen = false;
  }

}
