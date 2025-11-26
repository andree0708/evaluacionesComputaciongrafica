import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-pago-metodo',
  imports: [CommonModule, ButtonModule, CardModule, ToastModule],
  templateUrl: './pago-metodo.component.html',
  styleUrl: './pago-metodo.component.css'
})
export class PagoMetodoComponent implements OnInit {
  metodosPago = [
    { nombre: 'Efecty', icono: 'pi pi-money-bill' },
    { nombre: 'Visa', icono: 'pi pi-credit-card' },
    { nombre: 'MasterCard', icono: 'pi pi-credit-card' },
    { nombre: 'PayPal', icono: 'pi pi-paypal' }
  ];

  metodoSeleccionado: string | null = null;
  reservaData: any = {};
  user: any = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    
    // Obtener datos de la reserva desde query params
    this.route.queryParams.subscribe(params => {
      this.reservaData = {
        habitacionId: +params['habitacionId'],
        fechaEntrada: params['fechaEntrada'],
        fechaSalida: params['fechaSalida'],
        nombreCompleto: params['nombreCompleto'],
        email: params['email'],
        telefono: params['telefono']
      };
    });
  }

  seleccionarMetodo(metodo: string) {
    this.metodoSeleccionado = metodo;
  }

  procederPago() {
    if (this.metodoSeleccionado && this.user) {
      // Crear la reserva en el backend
      const reserva = {
        userId: this.user.id,
        habitacionId: this.reservaData.habitacionId,
        nombreCompleto: this.reservaData.nombreCompleto,
        email: this.reservaData.email,
        telefono: this.reservaData.telefono,
        fechaEntrada: this.reservaData.fechaEntrada,
        fechaSalida: this.reservaData.fechaSalida,
        metodoPago: this.metodoSeleccionado
      };

      this.apiService.createReserva(reserva).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Reserva confirmada',
            detail: `Tu reserva ha sido confirmada. Total: $${response.total}`
          });
          
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo procesar la reserva. Intenta nuevamente.'
          });
        }
      });
    }
  }
}
