import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule


import { ToasterService } from '../../../app/services/toaster.service';
import { UserLogoutAlertSms } from '../../utils/enums/alert-sms-toast.enum';

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar-nav.component.html',
  styleUrl: './sidebar-nav.component.scss',
})
export class SidebarNavComponent implements OnInit {
  userRole: string = '';
  userName: string = '';

  menuOptions: any[] = [];
  showNavbar: boolean = true;

  constructor(private toastr: ToasterService, private router: Router) {}

  ngOnInit(): void {
    // Lógica para verificar la ruta y ocultar el navbar si estamos en la página de inicio
    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;
      this.showNavbar = currentRoute !== '/welcome'; // Si la ruta es '/', no mostrar el navbar
    });
    this.getUserRole();
    this.setMenuOptions();
  }

  getUserRole(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = userString ? JSON.parse(userString) : null;
      this.userRole = user.userRol.rol;
      this.userName = user.email;
      console.log("____sidebar_FER__", this.userRole)
    } else {
      console.error('No user data found in localStorage');
    }
  }

  setMenuOptions(): void {
    if (this.userRole === 'admin') {
      this.menuOptions = [
        { name: 'Dashboard', route: '/dashboard' },
        { name: 'Usuarios', route: '/usuarios' },
        { name: 'Configuración', route: '/configuracion' }
      ];
    } else if (this.userRole === 'Usuario') {
      this.menuOptions = [
        { name: 'Inicio', route: '/inicio' },
        { name: 'Perfil', route: '/perfil' }
      ];
    } else {
      this.menuOptions = [
        { name: 'Inicio', route: '/inicio' }
      ];
    }
  }

  logoutUser(): void {
    localStorage.clear();
    this.toastr.showSuccess(UserLogoutAlertSms.SUCCESS);
    this.router.navigate(['welcome']);
  }
}
