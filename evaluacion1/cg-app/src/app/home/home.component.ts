import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { ImageModule } from 'primeng/image';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MenubarModule, InputTextModule, ButtonModule, CardModule, AccordionModule, ImageModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  menuItems = [
    { label: 'Inicio', icon: 'pi pi-home', routerLink: ['/home'] },
    { label: 'Características', icon: 'pi pi-star' },
    { label: 'Proyectos', icon: 'pi pi-search', items: [
      { label: 'Desarrollo de software a la medida' },
      { label: 'Desarrollo Móvil' },
      { label: 'Soporte a aplicaciones' }
    ] },
    { label: 'Contacto', icon: 'pi pi-envelope' }
  ];

  services = [
    {
      title: 'Desarrollo de software a la medida',
      subtitle: 'Servicio 1',
      image: 'https://s3-us-west-2.amazonaws.com/wp-mpro-blog/wp-content/uploads/2016/03/14133959/s3-blog-tecnologia-como-prioridad-min.png',
      description: 'Construimos soluciones de software personalizadas adaptadas a las necesidades específicas de tu empresa.'
    },
    {
      title: 'Desarrollo Móvil',
      subtitle: 'Servicio 2', 
      image: 'https://s3-us-west-2.amazonaws.com/wp-mpro-blog/wp-content/uploads/2016/03/14133959/s3-blog-tecnologia-como-prioridad-min.png',
      description: 'Desarrollamos aplicaciones móviles nativas e híbridas para iOS y Android con alto rendimiento.'
    },
    {
      title: 'Soporte a aplicaciones',
      subtitle: 'Servicio 3',
      image: 'https://s3-us-west-2.amazonaws.com/wp-mpro-blog/wp-content/uploads/2016/03/14133959/s3-blog-tecnologia-como-prioridad-min.png',
      description: 'Ofrecemos soporte técnico, mantenimiento y actualizaciones para todas tus aplicaciones.'
    }
  ];
}
