import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { FetchApiUserService } from '../../services/fetch-api-user.service';
import { CommonModule, DatePipe } from '@angular/common';
import { UserRegisterAlertSms } from '../../../shared/utils/enums/alert-sms-toast.enum';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
  providers: [DatePipe],
})
export class UserCreateComponent {
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Input() showCreateUser!: boolean;

  userForm: FormGroup;
  roles: string[] = ['admin', 'contador'];

  constructor(
    private fb: FormBuilder,
    private apiService: FetchApiUserService,
    private toastr: ToasterService
  ){
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      userRol: this.fb.group({
        rol: ['', Validators.required],
        description: ['', Validators.required],
      })
    });
  } 
  ngOnInit(): void {
    const rolControl = this.userForm.get('userRol')?.get('rol')
    console.log('Initial name state:', rolControl);
    rolControl?.updateValueAndValidity();
  }
  submitUser(): void {
    const rolControl = this.userForm.get('userRol')?.get('rol');
    console.log('Rol field state on submit:', rolControl);
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched(); // Highlight invalid fields
      this.toastr.showWarning(UserRegisterAlertSms.WARNING);
      return;
    }
    
    const payload = this.userForm.getRawValue();
    payload.status = 'active';
    this.apiService.createUser(payload).subscribe({
      next: () => {
        this.save.emit();
        this.toastr.showSuccess(UserRegisterAlertSms.SUCCESS);
      },
      error: (err) => {
        console.error('Failed to save user:', err);
      },
    });
    
  }
  cancelCreation() {
    this.cancel.emit();
  }

  
}
