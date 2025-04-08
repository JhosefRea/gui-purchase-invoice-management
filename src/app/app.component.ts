import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../shared/components/layout/layout.component';


@Component({
  selector: 'app-root',
  imports: [CommonModule, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'budget_classification';
  showNavbar = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = event.urlAfterRedirects !== '/welcome';
      }
    });
  }
}
