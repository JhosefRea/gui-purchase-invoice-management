import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEditComponent } from '../../../app/users/user-edit/user-edit.component';
import { ToasterService } from '../../../app/services/toaster.service';
import { UserDeleteAlertSms, UserEditAlertSms } from '../enums/alert-sms-toast.enum';

@Component({
  selector: 'app-modal',
  imports: [CommonModule, UserEditComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() message: string = ''; // Mensaje del modal
  @Input() mode: 'delete' | 'edit' = 'delete'; // Define si es delete o edit
  @Input() user: any; // Datos del usuario a editar

  @Output() confirmDelete = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() saveUserBtn = new EventEmitter<any>(); // Evento para indicar AL PADRE que CIERRE modal y envío usuario actualizado

  @ViewChild(UserEditComponent) userEditComponent!: UserEditComponent; // Referencia al componente UserEdit para función updateUser()

  isFormValid: boolean = false; // Controla si el formulario es válido

  constructor(private toastr: ToasterService) {}

  // ngAfterViewInit para asegurar que @ViewChild está disponible, debe ejecutarse después de que @ViewChild se haya resuelto
  ngAfterViewInit() {
    console.log(
      '_____MODAL COMPOENT:____userEditComponent después del ViewChild'
    );

    // Verifica si el componente hijo se ha cargado correctamente
    if (this.userEditComponent) {
      // Suscribirse al evento userUpdated del componente hijo
      this.userEditComponent.userUpdated.subscribe((updatedUser) => {
        this.onUserUpdated(updatedUser);
      });
    } else {
      this.toastr.showWarning(UserDeleteAlertSms.WARNING);
    }
  }

  onUserUpdated(updatedUser: any) {
    this.user = updatedUser;
    console.log('Usuario actualizado en el MODAL Commponent:', this.user);
    this.saveUserBtn.emit(this.user); // Evento para cerrar modal una vez se editó el usuario en user-editComponent
    // y envía al padre el usuario actualizado
  }

  onConfirm() {
    if (!this.isFormValid && this.mode === "edit" ) {
      this.toastr.showWarning(UserEditAlertSms.WARNING);
    }    
    if (this.isFormValid && this.userEditComponent ) {
      this.userEditComponent.updateUser(); // Evento que edita el usuario
    } else {
      this.confirmDelete.emit(); // Evento para eliminar
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  onFormValidityChanged(isValid: boolean) {
    this.isFormValid = isValid; // Actualiza el estado de la validez del formulario user-edit
  }
}
