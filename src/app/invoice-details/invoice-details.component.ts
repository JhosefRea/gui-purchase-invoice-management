import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

// pdf library
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

import { FetchApiDataService } from '../services/fetch-api-data.service';
import { InvoiceViewComponent } from '../invoice-view/invoice-view.component';
import { InvoiceEditComponent } from '../invoice-edit/invoice-edit.component';
import { ToasterService } from '../services/toaster.service';
import { PdfDownloadAlertSms } from '../../shared/utils/enums/alert-sms-toast.enum';


(<any>pdfMake).addVirtualFileSystem(pdfFonts);

@Component({
  selector: 'app-invoice-details',
  imports: [CommonModule, InvoiceViewComponent, InvoiceEditComponent],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.scss',
})
export class InvoiceDetailsComponent implements OnInit {
  invoice: any;
  isEditing: boolean = false;
  showDeleteConfirmation = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: FetchApiDataService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastr: ToasterService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    console.log("__________invoice-details.component________ngOnInit________ OBJECTID de params", id)
    if (id) {
      this.apiService.getInvoiceById(id).subscribe((data) => {
        this.invoice = data;
      });
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  markAsPaid(): void {
    if (this.invoice) {
      this.apiService.markInvoiceAsPaid(this.invoice.id).subscribe({
        next: (response) => {
          console.log(`Invoice marked as paid:`, response);
          this.invoice.status = 'paid'; // Update UI state
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to mark invoice as paid:', err.message);
          alert('Failed to mark invoice as paid. Please try again.');
        },
      });
    }
  }

  // show modal
  deleteInvoice() {
    this.showDeleteConfirmation = true;
  }

  // confirm deletion
  confirmDelete(): void {
    if (this.invoice) {
      this.apiService.deleteInvoice(this.invoice.id).subscribe(() => {
        console.log(`Deleting invoice: ${this.invoice.id}`);
        this.router.navigate(['/dashboard']);
        this.showDeleteConfirmation = false;
      });
    }
  }

  // cancel deletion
  cancelDelete() {
    this.showDeleteConfirmation = false;
  }

  saveChanges(updatedInvoice: any): void {
    if (this.invoice && this.invoice.einvoiceCatalogs) {
      console.log("____________savechanges()______invoice-details.component____________", this.invoice.einvoiceCatalogs);
      // Si existe el ID, hacemos un PUT (UPDATE)
      this.apiService.updateInvoice(this.invoice.id, updatedInvoice).subscribe({
        next: () => {
          this.invoice = { ...this.invoice, ...updatedInvoice };
          this.isEditing = false;
          console.log('Factura actualizada correctamente');
        },
        error: (error) => {
          console.error('Error al actualizar la factura', error);
        },
        complete: () => {
          console.log('La solicitud ha sido completada');
        }
      });
    } else {
      // Si no existe el ID, hacemos un POST (CREATE)
      this.apiService.postInvoice(updatedInvoice).subscribe({
        next: () => {
          this.invoice = { ...this.invoice, ...updatedInvoice };
          this.isEditing = false;
          console.log('Factura creada correctamente');
        },
        error: (error) => {
          console.error('Error al crear la factura', error);
        },
        complete: () => {
          // Este es opcional, se ejecuta cuando la solicitud se ha completado
          console.log('Creación de factura completada');
        }
      });
    }
  }

  generatePDF(): void {
    if (!this.invoice) {
      return;
    }

    const currentDate = new Date().toLocaleDateString();
    const paymentDueDate = new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(this.invoice.paymentDue));

    const docDefinition: TDocumentDefinitions = {
      content: [
        // Sección de encabezado con título
        {
          text: 'SRI',
          style: 'title',
          alignment: 'center',
          margin: [0, 20, 30, 60], // Añadido espacio arriba y abajo
        },

        {
          columns: [
            {
              text: `Factura #${this.invoice.id}`,
              style: 'header',
            },
            {
              text: [
                { text: 'Información del Remitente:\n', style: 'subheader' },
                `${this.invoice.clientName}\n`,
                `${this.invoice.senderAddress.street}\n`,
                `${this.invoice.senderAddress.city}, ${this.invoice.senderAddress.postCode}\n`,
                `${this.invoice.senderAddress.country}`,
              ],
              alignment: 'right',
            },
          ],
        },
        { text: `Fecha: ${currentDate}`, margin: [0, 10, 0, 5] },
        { text: `Cliente: GRUPO KFC`, margin: [0, 5, 0, 5] },
        {
          text: `Dirección: ${this.invoice.clientAddress.street}`,
          margin: [0, 0, 0, 5],
        },
        {
          text: `${this.invoice.clientAddress.city}, ${this.invoice.clientAddress.postCode}, ${this.invoice.clientAddress.country}`,
          margin: [0, 0, 0, 10],
        },

        // Sección de la tabla de ítems con estilo bonito
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              // Encabezado de la tabla con fondo y texto centrado
              [
                { text: 'Nombre del Producto', style: 'tableHeader' },
                { text: 'Cantidad', style: 'tableHeader' },
                { text: 'Precio', style: 'tableHeader' },
                { text: 'Total', style: 'tableHeader' },
              ],
              // Cuerpo de la tabla con filas alternas
              ...this.invoice.items.map((item: any) => {
                const total = item.quantity * item.price;
                return [
                  item.name,
                  item.quantity,
                  `$${item.price}`,
                  `$${total.toFixed(2)}`,
                ];
              }),
            ],
          },
          layout: 'lightHorizontalLines', // Estilo predefinido para la tabla
          margin: [0, 20, 0, 20], // Espacio arriba y abajo de la tabla
        },

        // Monto Total
        {
          text: `Total: $${this.invoice.total}`,
          style: 'total',
          margin: [0, 20, 0, 20],
        },
      ],
      styles: {
        title: {
          fontSize: 24,
          bold: true,
          color: '#000000',
        },
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 12,
          bold: true,
        },
        total: {
          fontSize: 16,
          bold: true,
          alignment: 'right',
        },
        tableHeader: {
          fillColor: '#f1f1f1', // Fondo gris claro para los encabezados
          bold: true,
          alignment: 'center', // Centrado de texto
          fontSize: 12,
          color: '#333', // Color de texto gris oscuro
          // Sin padding aquí
        },
      },
      defaultStyle: {
        fontSize: 10,
      },
    };

    pdfMake.createPdf(docDefinition).download(`Factura_${this.invoice.id}.pdf`);
    this.toastr.showSuccess(PdfDownloadAlertSms.SUCCESS);
  }
}
