import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { ImageModule } from 'primeng/image';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MenubarModule, InputTextModule, ButtonModule, CardModule, AccordionModule, ImageModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private router: Router) {}

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
      image: 'https://static.vecteezy.com/system/resources/thumbnails/022/060/169/small/programming-code-abstract-technology-background-of-software-developer-and-computer-script-generative-ai-photo.jpg',
      description: 'Construimos soluciones de software personalizadas adaptadas a las necesidades específicas de tu empresa.'
    },
    {
      title: 'Desarrollo Móvil',
      subtitle: 'Servicio 2', 
      image: 'https://www.ikusi.com/wp-content/uploads/2025/07/post_thumbnail-4efabca9bd56b38edc0058c4ba006481-1000x667.jpg',
      description: 'Desarrollamos aplicaciones móviles nativas e híbridas para iOS y Android con alto rendimiento.'
    },
    {
      title: 'Soporte a aplicaciones',
      subtitle: 'Servicio 3',
      image: 'https://mikeelectronica.com/cdn/shop/articles/B-MK_02_2121x.progressive.jpg?v=1607535378',
      description: 'Ofrecemos soporte técnico, mantenimiento y actualizaciones para todas tus aplicaciones.'
    }
  ];

  goToDetails() {
    this.router.navigate(['/details']);
  }
}
