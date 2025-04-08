export interface IResponse<T> {
  success: boolean; // Indica si la operación fue exitosa
  message: string; // Mensaje que se va a mostrar
  data?: T; // Datos opcionales (si los hay)
  //type: 'success' | 'error' | 'warning' | 'info'; // Tipo de mensaje (personalizable)
  type: string;
}
