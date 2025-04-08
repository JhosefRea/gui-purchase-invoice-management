import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserLoginFormComponent } from './login/login.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { UsersComponent } from './users/users.component';
import { ReportsViewComponent } from './reports-view/reports-view.component';

export const routes: Routes = [
  { path: 'welcome', component: WelcomePageComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: UserLoginFormComponent },
  { path: 'einvoices/:id', component: InvoiceDetailsComponent },
  { path: 'invoice/:id', component: InvoiceDetailsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'reports', component: ReportsViewComponent },

  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
];
