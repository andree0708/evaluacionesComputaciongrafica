import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { TabViewModule } from 'primeng/tabview';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    RouterLink,
    TableModule,
    ButtonModule,
    CardModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule,
    InputNumberModule,
    CheckboxModule,
    TabViewModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  providers: [ConfirmationService]
})
export class AdminComponent implements OnInit {
  reservas: any[] = [];
  reservaSeleccionada: any = null;
  mostrarDialog: boolean = false;
  user: any = null;
  
  // Gestión de habitaciones
  habitaciones: any[] = [];
  habitacionSeleccionada: any = null;
  mostrarDialogHabitacion: boolean = false;
  mostrarDialogNuevaHabitacion: boolean = false;
  nuevaHabitacion: any = {
    nombre: '',
    descripcion: '',
    tipo: '',
    precio: 0,
    capacidad: 1,
    disponible: true,
    imagenUrl: ''
  };
  
  // Tabs
  activeTabIndex: number = 0;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    
    if (this.user && this.user.rol === 'Administrador') {
      // Cargar habitaciones primero para poder mapearlas en reservas
      this.cargarHabitaciones();
      this.cargarReservas();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Acceso denegado',
        detail: 'No tienes permisos para acceder a esta sección'
      });
    }
  }

  cargarReservas() {
    this.apiService.getReservas().subscribe({
      next: (data) => {
        // Mapear reservas con información de habitación
        this.reservas = data.map((reserva: any) => {
          // Si el backend no trae la habitación, buscarla en el array local
          if (!reserva.habitacion && reserva.habitacionId) {
            const habitacion = this.habitaciones.find(h => h.id === reserva.habitacionId);
            if (habitacion) {
              reserva.habitacion = habitacion;
            } else {
              // Si no se encuentra, usar el ID como fallback
              reserva.habitacion = { nombre: `Habitación #${reserva.habitacionId}` };
            }
          }
          return reserva;
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las reservas'
        });
      }
    });
  }

  cargarHabitaciones() {
    this.apiService.getHabitaciones().subscribe({
      next: (data) => {
        this.habitaciones = data;
        // Recargar reservas para mapear habitaciones
        if (this.reservas.length > 0) {
          this.cargarReservas();
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las habitaciones'
        });
      }
    });
  }

  editarReserva(reserva: any) {
    this.reservaSeleccionada = { ...reserva };
    this.mostrarDialog = true;
  }

  guardarReserva() {
    if (this.reservaSeleccionada) {
      this.apiService.updateReserva(this.reservaSeleccionada.id, this.reservaSeleccionada).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Reserva actualizada correctamente'
          });
          this.mostrarDialog = false;
          this.cargarReservas();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la reserva'
          });
        }
      });
    }
  }

  eliminarReserva(reserva: any) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar la reserva de ${reserva.nombreCompleto}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.apiService.deleteReserva(reserva.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Reserva eliminada correctamente'
            });
            this.cargarReservas();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la reserva'
            });
          }
        });
      }
    });
  }

  getSeverity(estado: string): string {
    switch (estado) {
      case 'Confirmada':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'Cancelada':
        return 'danger';
      default:
        return 'info';
    }
  }

  logout() {
    this.authService.logout();
  }

  // Métodos para gestión de habitaciones
  nuevaHabitacionClick() {
    this.nuevaHabitacion = {
      nombre: '',
      descripcion: '',
      tipo: '',
      precio: 0,
      capacidad: 1,
      disponible: true,
      imagenUrl: ''
    };
    this.mostrarDialogNuevaHabitacion = true;
  }

  editarHabitacion(habitacion: any) {
    this.habitacionSeleccionada = { ...habitacion };
    this.mostrarDialogHabitacion = true;
  }

  guardarHabitacion() {
    if (this.habitacionSeleccionada) {
      this.apiService.updateHabitacion(this.habitacionSeleccionada.id, this.habitacionSeleccionada).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Habitación actualizada correctamente'
          });
          this.mostrarDialogHabitacion = false;
          this.cargarHabitaciones();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la habitación'
          });
        }
      });
    }
  }

  crearHabitacion() {
    if (this.nuevaHabitacion.nombre && this.nuevaHabitacion.tipo && this.nuevaHabitacion.precio > 0) {
      this.apiService.createHabitacion(this.nuevaHabitacion).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Habitación creada correctamente'
          });
          this.mostrarDialogNuevaHabitacion = false;
          this.cargarHabitaciones();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear la habitación'
          });
        }
      });
    }
  }

  eliminarHabitacion(habitacion: any) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar la habitación "${habitacion.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.apiService.deleteHabitacion(habitacion.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Habitación eliminada correctamente'
            });
            this.cargarHabitaciones();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la habitación'
            });
          }
        });
      }
    });
  }
}
