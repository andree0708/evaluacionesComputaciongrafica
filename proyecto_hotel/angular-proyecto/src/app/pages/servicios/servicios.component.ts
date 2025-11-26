import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-servicios',
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent {
  servicios = [
    {
      titulo: 'Desayuno Incluido',
      descripcion: 'Disfruta de un delicioso desayuno cada mañana con una amplia variedad de opciones.',
      imagen: 'https://imgs.search.brave.com/VZTUP5rtynuAOFPDnMYz_GxTl7XbYUwfNiJKHNgn9Qs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2h1dHRlcnN0b2Nr/LmNvbS9pbWFnZS1w/aG90by9pdGFsaWFu/LWhvdGVsLWJyZWFr/ZmFzdC1jaGVlc2Ut/c2xpY2VzLTI2MG53/LTI0NzM2MDQxMTcu/anBn'
    },
    { 
      titulo: 'Gimnasio',
      descripcion: 'Mantente en forma en nuestro gimnasio bien equipado con máquinas de última generación.',
      imagen: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop'
    },
    {
      titulo: 'Piscina',
      descripcion: 'Relájate en nuestra piscina al aire libre con vista al mar.',
      imagen: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop'
    },
    {
      titulo: 'Wi-Fi Gratis',
      descripcion: 'Conectividad de alta velocidad en todas las áreas del hotel.',
      imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    },
    {
      titulo: 'Spa',
      descripcion: 'Disfruta de tratamientos relajantes en nuestro spa de clase mundial.',
      imagen: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop'
    },
    {
      titulo: 'Restaurante',
      descripcion: 'Saborea la mejor cocina local e internacional en nuestro restaurante.',
      imagen: 'https://imgs.search.brave.com/V-qk20YP2GReCc2zHpjCcGdN6tLDaPIhPILyf1fYFrw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/Zm90b3MtcHJlbWl1/bS9kaXNlbm8taW50/ZXJpb3Jlcy1yZXN0/YXVyYW50ZXNfMTQw/OS03NDQyLmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDAmcT04/MA'
    }
  ];
}
