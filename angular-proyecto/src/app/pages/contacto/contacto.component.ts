import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-contacto',
  imports: [CommonModule, CardModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  contacto = {
    direccion: 'Calle 13 , Cartagena',
    telefono: '+57 3006312585',
    email: 'info@hoteltropical.com',
    horario: 'Lunes a Domingo: 24 horas'
  };
}
