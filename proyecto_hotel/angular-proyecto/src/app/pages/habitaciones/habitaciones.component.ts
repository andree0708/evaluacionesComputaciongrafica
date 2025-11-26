import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-habitaciones',
  imports: [CommonModule, CardModule, ButtonModule, TagModule, DialogModule],
  templateUrl: './habitaciones.component.html',
  styleUrl: './habitaciones.component.css'
})
export class HabitacionesComponent implements OnInit {
  habitaciones: any[] = [];

  detalleVisible = false;
  habitacionSeleccionada: any = null;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.apiService.getHabitaciones().subscribe({
      next: (data) => {
        this.habitaciones = data.map((habitacion: any) => ({
          ...habitacion,
          tag: habitacion.tipo === 'Suite' ? 'Lujo' : habitacion.tipo === 'Doble' ? 'Más popular' : 'Económica',
          tagSeverity: habitacion.tipo === 'Suite' ? ('warn' as const) : habitacion.tipo === 'Doble' ? ('success' as const) : ('info' as const)
        }));
      },
      error: () => {
        this.habitaciones = [
          {
            id: 1,
            nombre: 'Habitación Doble',
            descripcion: 'Hasta 4 personas, cama doble, escritorio y balcón con vista al jardín.',
            precio: 150,
            capacidad: 4,
            tag: 'Más popular',
            tagSeverity: 'success' as const
          },
          {
            id: 2,
            nombre: 'Suite',
            descripcion: 'Suite de lujo con vista panorámica, jacuzzi privado y servicio VIP.',
            precio: 300,
            capacidad: 2,
            tag: 'Lujo',
            tagSeverity: 'warn' as const
          },
          {
            id: 3,
            nombre: 'Habitación Individual',
            descripcion: 'Habitación acogedora ideal para viajeros individuales, incluye desayuno.',
            precio: 80,
            capacidad: 1,
            tag: 'Económica',
            tagSeverity: 'info' as const
          }
        ];
      }
    });
  }

  reservar(id: number) {
    // Verificar si el usuario está autenticado
    // Si no, el guard lo redirigirá al login
    this.router.navigate(['/reserva'], { queryParams: { habitacion: id } });
  }

  verDetalles(habitacion: any) {
    this.habitacionSeleccionada = habitacion;
    this.detalleVisible = true;
  }
}
