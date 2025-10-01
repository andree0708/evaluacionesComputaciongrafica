import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { ImageModule } from 'primeng/image';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  imports: [ToastModule, ButtonModule, MenubarModule, ImageModule, CommonModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
  buttonAnimation = 'pulse 0.3s ease-in-out';
  
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

  constructor(private messageService: MessageService) {}

  show(severity: string) {
    this.messageService.add({
      severity: severity as any,
      summary: severity.charAt(0).toUpperCase() + severity.slice(1),
      detail: 'Message Content'
    });
  }
}
