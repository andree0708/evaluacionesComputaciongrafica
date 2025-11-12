import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-habitaciones',
  imports: [CommonModule, CardModule, ButtonModule, TagModule, RouterLink],
  templateUrl: './habitaciones.component.html',
  styleUrl: './habitaciones.component.css'
})
export class HabitacionesComponent {
  habitaciones = [
    {
      id: 1,
      nombre: 'Habitación Doble',
      descripcion: 'Hasta 4 personas, cama doble.',
      tag: 'Más popular',
      tagSeverity: 'success' as const
    },
    {
      id: 2,
      nombre: 'Suite',
      descripcion: 'Con vista al mar y jacuzzi.',
      tag: 'Lujo',
      tagSeverity: 'warn' as const
    },
    {
      id: 3,
      nombre: 'Habitación Individual',
      descripcion: 'Ideal para una persona.',
      tag: 'Económica',
      tagSeverity: 'info' as const
    }
  ];

  constructor(private router: Router) {}

  reservar(id: number) {
    // Navegar a la página de reserva con el ID de la habitación
    this.router.navigate(['/reserva'], { queryParams: { habitacion: id } });
  }
}
