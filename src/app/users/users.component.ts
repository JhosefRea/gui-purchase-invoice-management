import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FetchApiUserService } from '../services/fetch-api-user.service';
import { UserCreateComponent } from './user-create/user-create.component';
import { ModalComponent } from '../../shared/utils/modal/modal.component';
import { ToasterService } from '../services/toaster.service';
import { UserEditAlertSms, UserDeleteAlertSms } from '../../shared/utils/enums/alert-sms-toast.enum';

interface UserRolDTO {
  rol: string;
  description: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  userRol: UserRolDTO;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-users',
  imports: [CommonModule, UserCreateComponent, ModalComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  showCreateUser: boolean = false;
  filteredUsers: User[] = [];
  showFilterDropdown = false;
  selectedRoles: string[] = []; // to store checked status
  showModal = false;
  selectedUser: any;
  modalMode: 'delete' | 'edit' = 'delete';
  modalMessage: string;

  // Inject FetchApiUserService
  constructor(
    private fetchApiData: FetchApiUserService,
    private toastr: ToasterService
  ) {}

  ngOnInit(): void {
    console.log('UsersComponent initialized');
    this.getUsers();
  }

  getUsers(): void {
    this.fetchApiData.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.filteredUsers = [...this.users];
        console.log('Users fetched successfully:', this.users);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });
  }

  openCreateUserForm() {
    this.showCreateUser = true;
  }

  onUserSaved() {
    // Close the modal
    this.showCreateUser = false;

    // Refresh the invoices list
    this.getUsers();
  }

  onCancelUserCreation() {
    // Close the modal without refreshing
    this.showCreateUser = false;
  }

  toggleFilterDropdown() {
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  onStatusChange(status: string, isChecked: boolean) {
    console.log(`Status ${status} isChecked: ${isChecked}`);

    if (isChecked) {
      this.selectedRoles.push(status);
    } else {
      this.selectedRoles = this.selectedRoles.filter((s) => s !== status);
    }
    console.log('Selected statuses:', this.selectedRoles);

    this.applyFilters();
  }

  applyFilters() {
    console.log('Applying filters with selected statuses:', this.selectedRoles);

    if (this.selectedRoles.length > 0) {
      this.filteredUsers = this.users.filter((user) =>
        this.selectedRoles.includes(user.userRol.rol)
      );
    } else {
      this.filteredUsers = [...this.users]; // Reset to all invoices if no filter
    }
    console.log('Filtered users:', this.filteredUsers);
  }

  //MODAL EDIT AN DELETE
  openDeleteModal(user: any): void {
    this.selectedUser = { ...user }; // Clonar para evitar modificar directamente
    this.modalMode = 'delete';
    this.modalMessage = `¿Estás seguro de eliminar a ${user.name}?`;
    this.showModal = true;
  }

  openEditModal(user: any) {
    this.selectedUser = { ...user }; // Clonar para evitar modificar directamente
    this.modalMode = 'edit';
    this.modalMessage = `Editar usuario ${user.name}`;
    this.showModal = true;
  }

  // Este método es llamado cuando el evento saveUser es emitido
  onSaveUser(userUpdated: any) {
    console.log('___UserComponent___Usuario actualizado...', userUpdated);
    this.toastr.showSuccess(UserEditAlertSms.SUCCESS);
    this.closeModal();
    this.getUsers(); // Refresh the users list, before deleteUser
  }

  handleUserDeleted(): void {
    if (this.modalMode === 'delete') {
      this.fetchApiData.deleteUser(this.selectedUser._id).subscribe(() => {
        console.log('Usuario eliminado correctamente!');
        this.toastr.showSuccess(UserDeleteAlertSms.SUCCESS);
        this.closeModal();
        this.getUsers(); // Refresh the users list, before deleteUser
      });
    }
  }

  closeModal() {
    this.showModal = false;
  }
}
