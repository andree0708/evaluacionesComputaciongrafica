import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pago-confirmacion',
  imports: [FormsModule, InputTextModule, ButtonModule, CardModule, RouterLink],
  templateUrl: './pago-confirmacion.component.html',
  styleUrl: './pago-confirmacion.component.css'
})
export class PagoConfirmacionComponent implements OnInit {
  nombre: string = '';
  correo: string = '';
  telefono: string = '';
  reservaData: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.nombre = user.nombre;
      this.correo = user.email;
    }

    // Obtener datos de la reserva desde query params
    this.route.queryParams.subscribe(params => {
      this.reservaData = {
        habitacionId: params['habitacionId'],
        fechaEntrada: params['fechaEntrada'],
        fechaSalida: params['fechaSalida']
      };
    });
  }

  confirmar() {
    if (this.nombre && this.correo && this.telefono) {
      // Navegar a la página de método de pago con todos los datos
      this.router.navigate(['/pago-metodo'], {
        queryParams: {
          ...this.reservaData,
          nombreCompleto: this.nombre,
          email: this.correo,
          telefono: this.telefono
        }
      });
    }
  }
}
