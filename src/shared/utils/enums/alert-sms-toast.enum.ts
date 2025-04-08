export enum UserLoginAlertSms {
  SUCCESS = 'Inicio de sesión exitoso.',
  ERROR = 'Error en las credenciales. Verifica e intenta nuevamente.',
  WARNING = 'Tu cuenta está bloqueada. Contacta al administrador.',
  INFO = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
}

export enum UserRegisterAlertSms {
  SUCCESS = 'Usuario registrado con éxito.',
  ERROR = 'Error al registrar el usuario. Intenta nuevamente.',
  WARNING = 'Verifica los campos del formulario antes de guardar los cambios',
  INFO = 'Revisa tu correo para activar tu cuenta.',
}

export enum UserEmailAlertSms {
  SUCCESS = 'Usuario registrado con éxito.',
  ERROR = 'Error al registrar el usuario. Intenta nuevamente.',
  WARNING = 'El correo ya está en uso. Usa otro o recupera tu cuenta.',
  INFO = 'Revisa tu correo para activar tu cuenta.',
}

export enum UserLogoutAlertSms {
  SUCCESS = 'Has cerrado sesión correctamente.',
  ERROR = 'Error al cerrar sesión. Intenta nuevamente.',
  WARNING = 'Tu sesión ha expirado. Inicia sesión nuevamente.',
  INFO = 'Has sido desconectado por inactividad.',
}

export enum PdfDownloadAlertSms {
  SUCCESS = 'El archivo PDF ha sido descargado correctamente.',
  ERROR = 'Ocurrió un error al descargar el PDF. Intenta nuevamente.',
  WARNING = 'La descarga podría tardar más de lo esperado.',
  INFO = 'Generando el archivo PDF, espera un momento...',
}

export enum InvoiceEditAlertSms {
  SUCCESS = 'Factura actualizada con éxito.',
  ERROR = 'Ocurrió un error al actualizar la factura.',
  WARNING = 'Verifica los campos del formulario antes de guardar los cambios.',
  INFO = 'Modifica los campos necesarios y guarda los cambios.',
}

/*
export enum UserAlertSms {
  SUCCESS = 'Operación realizada con éxito.',
  ERROR = 'Ocurrió un error inesperado.',
  WARNING = 'Atención: Verifica los datos ingresados.',
  INFO = 'Información actualizada correctamente.',
}*/

export enum UserEditAlertSms {
  SUCCESS = 'El usuario ha sido actualizado correctamente.',
  ERROR = 'Hubo un problema al actualizar el usuario.',
  WARNING = 'Revisa los datos ingresados antes de guardar.',
  INFO = 'Los datos del usuario han sido modificados.',
}

export enum UserDeleteAlertSms {
  SUCCESS = 'El usuario ha sido eliminado correctamente.',
  ERROR = 'Hubo un problema al eliminar el usuario.',
  WARNING = 'Esta acción es irreversible.',
  INFO = 'El usuario ha sido marcado para eliminación.',
}
