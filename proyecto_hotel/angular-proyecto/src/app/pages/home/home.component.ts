import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ButtonModule, CommonModule, CardModule, RatingModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  testimonios = [
    {
      nombre: 'Maria González',
      comentario: '¡Una experiencia increíble! El servicio fue excepcional y la habitación muy cómoda. Definitivamente volveré.',
      rating: 5
    },
    {
      nombre: 'Carlos Ramírez',
      comentario: 'El hotel superó todas mis expectativas. La atención al cliente es de primera clase y las instalaciones están impecables.',
      rating: 5
    },
    {
      nombre: 'Ana Martínez',
      comentario: 'Pasamos una semana maravillosa. El desayuno es delicioso y el personal muy amable. Lo recomiendo totalmente.',
      rating: 5
    }
  ];
}
