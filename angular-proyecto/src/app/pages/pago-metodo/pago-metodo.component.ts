import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-pago-metodo',
  imports: [CommonModule, ButtonModule, CardModule, ToastModule],
  templateUrl: './pago-metodo.component.html',
  styleUrl: './pago-metodo.component.css'
})
export class PagoMetodoComponent {
  metodosPago = [
    { nombre: 'Efecty', icono: 'pi pi-money-bill' },
    { nombre: 'Visa', icono: 'pi pi-credit-card' },
    { nombre: 'MasterCard', icono: 'pi pi-credit-card' },
    { nombre: 'PayPal', icono: 'pi pi-paypal' }
  ];

  metodoSeleccionado: string | null = null;

  constructor(private router: Router, private messageService: MessageService) {}

  seleccionarMetodo(metodo: string) {
    this.metodoSeleccionado = metodo;
  }

  procederPago() {
    if (this.metodoSeleccionado) {
      this.messageService.add({
        severity: 'success',
        summary: 'Pago procesado',
        detail: `Pago procesado con ${this.metodoSeleccionado}`
      });
      // Aquí se procesaría el pago
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    }
  }
}
