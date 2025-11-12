import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reserva',
  imports: [FormsModule, InputTextModule, ButtonModule, CardModule, CommonModule],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css'
})
export class ReservaComponent {
  nombreCompleto: string = '';
  fechaEntrada: string = '';
  fechaSalida: string = '';

  constructor(private router: Router) {}

  enviarReserva() {
    if (this.nombreCompleto && this.fechaEntrada && this.fechaSalida) {
      // Navegar a la página de confirmación de pago
      this.router.navigate(['/pago-confirmacion']);
    }
  }
}
