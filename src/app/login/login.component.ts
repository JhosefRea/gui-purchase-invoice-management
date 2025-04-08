import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FetchApiDataService } from '../services/fetch-api-data.service';
import { Router } from '@angular/router';
import { ToasterService } from '../services/toaster.service';
import { FormsModule } from '@angular/forms';
import { UserLoginAlertSms } from '../../shared/utils/enums/alert-sms-toast.enum';

@Component({
  selector: 'app-user-login-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  userData = { email: '', password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    private toasterService: ToasterService, // Inject ToastService
    private router: Router
  ) {}

  ngOnInit(): void {}
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (response) => {
        if (response && response.access_token) {  // Verifica que la respuesta no sea undefined
          localStorage.setItem('user', JSON.stringify(response.user || {})); // Almacena user info
          localStorage.setItem('access_token', response.access_token); // Almacena access_token
  
          console.log("User saved in localStorage:", localStorage.getItem('user'));
          console.log("access_token saved in localStorage:", localStorage.getItem('access_token'));
  
          this.toasterService.showSuccess(UserLoginAlertSms.SUCCESS)
          this.router.navigate(['dashboard']);
        } else {
          console.error("Error: Respuesta inesperada del backend", response);
          this.toasterService.showWarning(UserLoginAlertSms.WARNING)
        }
      },
      (error) => {
        console.error("Error en el login:", error);
        //this.toasterService.showError(`Error: ${error.message || error}`);
        this.toasterService.showError(UserLoginAlertSms.ERROR);
      }
    );
  }
  
}
