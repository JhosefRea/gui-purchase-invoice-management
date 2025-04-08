import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { IResponse } from '../../shared/utils/models/response.toast.interface';

@Injectable({
  providedIn: 'root', // Este servicio estará disponible en toda la aplicación
})
export class ToasterService {
  constructor(private toastr: ToastrService) {}

  showSuccess(message: string) {
    this.showAlert('success', message, true);
  }

  showWarning(message: string) {
    this.showAlert('warning', message, false);
  }

  showError(message: string) {
    this.showAlert('error', message, false);
  }


  private showAlert(
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
    success: boolean
  ) {
    const response = {
      success,
      message,
      type,
    };
    this.handleResponse(response);
  }

  handleResponse<T>(response: IResponse<T>) {
    const { message, success, type } = response;

    // success es de tipo boolean
    if (success) {
      // Si la respuesta es true, entonces el mensaje se usa para 'success' o 'info'
      this.showNotification(type, message);
    } else {
      // Sino el mensaje se usa para 'error' o 'warning'
      this.showNotification(type, message);
    }
  }

  private showNotification(type: string, message: string) {
    // Mostrar la notificación según el 'type
    switch (type) {
      case 'success':
        this.toastr.success(message, 'Exitoso');
        break;
      case 'error':
        this.toastr.error(message, 'Error');
        break;
      case 'warning':
        this.toastr.warning(message, 'Advertencia | Atención');
        break;
      case 'info':
        this.toastr.info(message, 'Información');
        break;
    }
  }
}
