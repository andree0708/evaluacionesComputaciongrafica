import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-pago-confirmacion',
  imports: [FormsModule, InputTextModule, ButtonModule, CardModule, RouterLink],
  templateUrl: './pago-confirmacion.component.html',
  styleUrl: './pago-confirmacion.component.css'
})
export class PagoConfirmacionComponent {
  nombre: string = '';
  correo: string = '';
  telefono: string = '';

  constructor(private router: Router) {}

  confirmar() {
    if (this.nombre && this.correo && this.telefono) {
      // Navegar a la página de método de pago
      this.router.navigate(['/pago-metodo']);
    }
  }
}
