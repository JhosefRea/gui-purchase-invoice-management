import { Component, EventEmitter, OnInit, Output, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FetchApiReportService } from '../services/fetch-api-report.service';
import { RouterModule } from '@angular/router';


interface Invoice {
  id: string;
  clientName: string;
  total: number;
  paymentDue: string;
}

@Component({
  selector: 'app-reports-view',
  standalone: true,
  // ChangeDetection: ChangeDetectionStrategy.OnPush, // To improve performance with large data se
  imports: [CommonModule, RouterModule ],
  templateUrl: './reports-view.component.html',
  styleUrl: './reports-view.component.scss'
})
export class ReportsViewComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];

  // Inject FetchApiDataService
  constructor(private fetchApiReport: FetchApiReportService) {}

  // Lifecycle hook that runs when the component is initialized
  ngOnInit(): void {
    this.getReports();
  }

  // Fetch invoices from the service
  getReports(): void {
    this.fetchApiReport.getAllReports().subscribe({
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
}





