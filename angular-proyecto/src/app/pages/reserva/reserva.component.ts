import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-reserva',
  imports: [FormsModule, InputTextModule, ButtonModule, CardModule, CommonModule, DropdownModule, ToastModule],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css',
  providers: [MessageService]
})
export class ReservaComponent implements OnInit {
  nombreCompleto: string = '';
  fechaEntrada: string = '';
  fechaSalida: string = '';
  habitaciones: any[] = [];
  habitacionSeleccionada: any = null;
  user: any = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private apiService: ApiService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.nombreCompleto = this.user.nombre;
    }

    // Cargar habitaciones
    this.apiService.getHabitaciones().subscribe({
      next: (data) => {
        this.habitaciones = data.map((h: any) => ({
          label: `${h.nombre} - $${h.precio}/noche`,
          value: h
        }));
      },
      error: (error) => {
        console.error('Error al cargar habitaciones:', error);
      }
    });

    // Obtener habitación desde query params si existe
    this.route.queryParams.subscribe(params => {
      if (params['habitacion']) {
        this.apiService.getHabitacion(+params['habitacion']).subscribe({
          next: (habitacion) => {
            this.habitacionSeleccionada = { label: `${habitacion.nombre} - $${habitacion.precio}/noche`, value: habitacion };
          }
        });
      }
    });
  }

  enviarReserva() {
    if (this.nombreCompleto && this.fechaEntrada && this.fechaSalida && this.habitacionSeleccionada) {
      // Validar que la fecha de salida sea posterior a la de entrada
      if (new Date(this.fechaSalida) <= new Date(this.fechaEntrada)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'La fecha de salida debe ser posterior a la fecha de entrada'
        });
        return;
      }

      // Verificar disponibilidad antes de continuar
      this.apiService.verificarDisponibilidad(
        this.habitacionSeleccionada.value.id,
        this.fechaEntrada,
        this.fechaSalida
      ).subscribe({
        next: (response) => {
          if (response.disponible) {
            // Navegar a la página de confirmación de pago
            this.router.navigate(['/pago-confirmacion'], {
              queryParams: {
                habitacionId: this.habitacionSeleccionada.value.id,
                fechaEntrada: this.fechaEntrada,
                fechaSalida: this.fechaSalida
              }
            });
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Habitación no disponible',
              detail: response.mensaje || 'La habitación ya está reservada para esas fechas. Por favor, selecciona otras fechas.'
            });
          }
        },
        error: (error) => {
          // Si el endpoint no existe aún, continuar sin validación
          if (error.status === 404) {
            this.router.navigate(['/pago-confirmacion'], {
              queryParams: {
                habitacionId: this.habitacionSeleccionada.value.id,
                fechaEntrada: this.fechaEntrada,
                fechaSalida: this.fechaSalida
              }
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo verificar la disponibilidad. Intenta nuevamente.'
            });
          }
        }
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos incompletos',
        detail: 'Por favor, completa todos los campos del formulario'
      });
    }
  }
}
