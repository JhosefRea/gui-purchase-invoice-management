import { Component, EventEmitter, OnInit, Output, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FetchApiDataService } from '../services/fetch-api-data.service';
import { RouterModule } from '@angular/router';

interface Invoice {
  id: string;
  clientName: string;
  total: number;
  paymentDue: string;
  status: 'ingresado' | 'aprobado'; //draft pending paid
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  invoices: Invoice[] = [];
  showCreateInvoice: boolean = false;
  filteredInvoices: Invoice[] = [];
  showFilterDropdown = false;
  selectedStatuses: string[] = []; // to store checked status

  // Inject FetchApiDataService
  constructor(private fetchApiData: FetchApiDataService) {}

  // Lifecycle hook that runs when the component is initialized
  ngOnInit(): void {
    this.getInvoices();
  }

  // Fetch invoices from the service
  getInvoices(): void {
    this.fetchApiData.getAllInvoices().subscribe({
      next: (data: Invoice[]) => {
        this.invoices = data;
        this.filteredInvoices = [...this.invoices];
        console.log('Invoices fetched successfully:', this.invoices);
      },
      error: (err) => {
        console.error('Error fetching invoices:', err);
      },
    });
  }

  openCreateInvoiceForm() {
    this.showCreateInvoice = true;
  }

  onInvoiceSaved() {
    // Close the modal
    this.showCreateInvoice = false;

    // Refresh the invoices list
    this.getInvoices();
  }

  onCancelInvoiceCreation() {
    // Close the modal without refreshing
    this.showCreateInvoice = false;
  }

  toggleFilterDropdown() {
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  onStatusChange(status: string, isChecked: boolean) {
    console.log(`Status ${status} isChecked: ${isChecked}`);

    if (isChecked) {
      this.selectedStatuses.push(status);
    } else {
      this.selectedStatuses = this.selectedStatuses.filter((s) => s !== status);
    }
    console.log('Selected statuses:', this.selectedStatuses);

    this.applyFilters();
  }

  applyFilters() {
    console.log(
      'Applying filters with selected statuses:',
      this.selectedStatuses
    );

    if (this.selectedStatuses.length > 0) {
      this.filteredInvoices = this.invoices.filter((invoice) =>
        this.selectedStatuses.includes(invoice.status)
      );
    } else {
      this.filteredInvoices = [...this.invoices]; // Reset to all invoices if no filter
    }
    console.log('Filtered invoices:', this.filteredInvoices);
  }
}
