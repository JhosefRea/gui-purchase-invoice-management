import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FetchApiUserService } from '../../services/fetch-api-user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  @Input() user: any;
  @Input() message: string;
  
  @Output() userUpdated = new EventEmitter<any>(); // Para emitir cualquier valor
  @Output() formValidityChanged = new EventEmitter<boolean>(); // Nuevo evento para notificar la validez del formulario

  userForm: FormGroup;
  roles: string[] = ['admin', 'contador'];

  constructor(
    private fb: FormBuilder,
    private apiService: FetchApiUserService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    console.log('________useredit.component________', this.user);

    this.userForm = this.fb.group({
      id: [this.user._id], 
      name: [this.user?.name, Validators.required],
      email: [this.user?.email, [Validators.required, Validators.email]],
      userRol: this.fb.group({
        rol: ['', Validators.required],
        description: ['', Validators.required],
      })
    });

    // Verificamos si el formulario es válido cuando se inicializa
    this.userForm.statusChanges.subscribe(status => {
      this.formValidityChanged.emit(this.userForm.valid); // Emitimos la validez del formulario
    });
  }

  updateUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched(); // Resalta los campos inválidos en la interfaz
      return;
    }

    const payload = {
      ...this.userForm.getRawValue(),
      password: this.user.password,  // Agregar el campo password
      status: this.user.status // Agregar el campo status (valor por defecto si no está presente)
    };

    console.log("____________user-edit_________PAYLOAD", payload);


    this.apiService.updateUser(payload.id, payload).subscribe({
      next: () => {
        this.userUpdated.emit(payload); // Emitir el evento al padre cuando se guarda el usuario
      },
      error: (err) => console.error('Failed to save user:', err),
    });
  }
}
