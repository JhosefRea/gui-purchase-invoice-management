import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ToasterService } from '../services/toaster.service';
import { InvoiceEditAlertSms } from '../../shared/utils/enums/alert-sms-toast.enum';

@Component({
  selector: 'app-invoice-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './invoice-edit.component.html',
  styleUrl: './invoice-edit.component.scss',
  providers: [DatePipe],
})
export class InvoiceEditComponent {
  @Input() invoice: any;
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  invoiceForm: FormGroup;
  options: string[] = [
    'Otros negocios',
    'Otros países',
    'Facturas mixtas',
    'Facturas locales',
    'TICs',
  ];

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToasterService
  ) {}

  ngOnInit(): void {
    const formattedDate = this.datePipe.transform(
      this.invoice.createdAt,
      'd MMM y'
    );
    this.invoice.createdAt = formattedDate; // Format the date
    this.initializeForm();
  }

  initializeForm(): void {
    console.log('Invoice data', this.invoice);

    const itemsArray = this.createItemsArray(this.invoice.items || []);

    this.invoiceForm = this.fb.group({
      id: [this.invoice.id || ''],
      senderAddress: this.fb.group({
        street: [this.invoice.senderAddress.street || ''],
        city: [this.invoice.senderAddress.city || ''],
        postCode: [this.invoice.senderAddress.postCode || '', ,],
        country: [this.invoice.senderAddress.country],
      }),
      clientAddress: this.fb.group({
        street: [this.invoice.clientAddress.street],
        city: [this.invoice.clientAddress.city],
        postCode: [this.invoice.clientAddress.postCode],
        country: [this.invoice.clientAddress.country],
      }),
      clientName: [this.invoice.clientName],
      clientEmail: [
        this.invoice.clientEmail,
        [Validators.required, Validators.email],
      ],
      description: [this.invoice.description],
      paymentTerms: [this.invoice.paymentTerms],
      createdAt: [{ value: this.invoice.createdAt || '', disabled: true }],
      total: [this.invoice.total, [, Validators.min(0)]],
      items: this.fb.array(itemsArray),
      einvoiceCatalogs: ['', Validators.required],
    });
    console.log('Initialized FormArray:', this.invoiceForm.get('items'));
  }

  createItemsArray(items: any[]): FormGroup[] {
    if (!Array.isArray(items)) {
      console.error('Items is not an array:', items);
      return [];
    }

    return items.map((item) => {
      console.log('Creating FormGroup for item:', item);
      return this.fb.group({
        name: [item.name || '', Validators.required],
        quantity: [
          item.quantity || 0,
          [Validators.required, Validators.min(1)],
        ],
        price: [item.price || 0, [Validators.required, Validators.min(0)]],
        total: [
          { value: item.quantity * item.price || 0, disabled: true },
          Validators.required,
        ],
      });
    });
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      name: [''],
      quantity: [0],
      price: [0],
      total: [{ value: 0, disabled: true }],
    });

    // Calculate total whenever quantity or price changes
    itemGroup.get('quantity')?.valueChanges.subscribe(() => {
      this.updateItemTotal(itemGroup);
    });
    itemGroup.get('price')?.valueChanges.subscribe(() => {
      this.updateItemTotal(itemGroup);
    });

    this.items.push(itemGroup);
  }

  updateItemTotal(item: FormGroup): void {
    const quantity = item.get('quantity')?.value || 0;
    const price = item.get('price')?.value || 0;
    const total = quantity * price;
    item.get('total')?.setValue(total, { emitEvent: false });
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  createEinvoice() {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched(); // Highlight invalid fields
    }
    if (this.invoiceForm.valid) {
      const updatedItems = this.invoiceForm.value.items;

      // Calculate new total
      const updatedTotal = updatedItems.reduce(
        (sum: number, item: { quantity: number; price: number }) =>
          sum + item.quantity * item.price,
        0
      );

      const payload = this.invoiceForm.getRawValue();
      console.log('______Invoice-Edit____payload_____________****', payload);
      payload.status = 'aprobado';

      const updatedInvoice = {
        ...this.invoiceForm.value, // Aplica los valores del formulario
        total: updatedTotal,
        status: payload.status,
        einvoiceCatalogs: this.invoiceForm.value.einvoiceCatalogs, // necesario para el REST API
        paymentDue: this.invoice.paymentDue, // necesario para el REST API
        createdAt: this.invoice.createdAt, // necesario para el REST API
      };

      // Verifica si los valores obligatorios existen; si no, los asigna
      if (updatedInvoice.id) {
        updatedInvoice.id = this.invoice?.id; // Usa el ID existente o déjalo vacío
        this.save.emit(updatedInvoice); // Emit saved changes to parent
        this.toastr.showSuccess(InvoiceEditAlertSms.SUCCESS);
      }

      /*ESTO HACÍAQ SE DUPLIQUEN LOS REGISTTROS EN LA DB
    // Update the invoice in the database
    this.apiService.postInvoice(updatedInvoice).subscribe({
      next: () => {
        this.save.emit(updatedInvoice); // Emit saved changes to parent
      },
      error: (err) => {
        console.error('Error updating invoice:', err);
      },
    });*/
    }else {
      this.toastr.showWarning(InvoiceEditAlertSms.WARNING);
    }
  }

  cancelEdit(): void {
    this.cancel.emit();
  }
}
