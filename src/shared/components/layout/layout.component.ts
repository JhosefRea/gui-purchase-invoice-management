import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';
import { HeaderComponent } from '../header/header.component';
import { ReportsViewComponent } from '../../../app/reports-view/reports-view.component';
import { CommonModule } from '@angular/common'; // Importa CommonModule


@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarNavComponent, HeaderComponent, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit{
  showSidebarNav: boolean = false; // Variable para controlar la visibilidad

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Subscribe to the router events to detect the current route
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        // Si la ruta es 'welcome', ocultamos el SidebarNav
        this.showSidebarNav = event.url !== '/welcome';
      });
  }
}
