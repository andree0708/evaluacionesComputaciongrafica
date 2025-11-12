import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-servicios',
  imports: [CommonModule, CardModule, ButtonModule, RatingModule, FormsModule, RouterLink],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent {
  servicios = [
    {
      titulo: 'Desayuno Incluido',
      descripcion: 'Disfruta de un delicioso desayuno cada mañana.'
    },
    {
      titulo: 'Gimnasio',
      descripcion: 'Mantente en forma en nuestro gimnasio bien equipado.'
    }
  ];

  testimonios = [
    {
      nombre: 'Maria',
      comentario: '¡Una experiencia increíble! Volveré sin duda.',
      rating: 5
    },
    {
      nombre: 'Carlos',
      comentario: 'El servicio fue excepcional y la habitación muy cómoda.',
      rating: 5
    }
  ];
}
