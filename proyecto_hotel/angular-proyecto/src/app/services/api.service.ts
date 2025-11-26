import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ⚠️ IMPORTANTE: Verifica el puerto correcto en Visual Studio cuando ejecutas el backend
// El puerto aparece en la consola: "Now listening on: https://localhost:XXXX"
// Cambia el número de puerto aquí si es diferente (puede ser 7128, 7265, 5001, etc.)
const API_URL = 'https://localhost:7265/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // Login
  login(nombreUsuario: string, password: string): Observable<any> {
    return this.http.post(`${API_URL}/Users/Login`, {
      nombreUsuario,
      password
    });
  }

  // Registro
  register(user: any): Observable<any> {
    return this.http.post(`${API_URL}/Users/Register`, user);
  }

  // Habitaciones
  getHabitaciones(): Observable<any> {
    return this.http.get(`${API_URL}/Habitaciones`);
  }

  getHabitacion(id: number): Observable<any> {
    return this.http.get(`${API_URL}/Habitaciones/${id}`);
  }

  // Reservas
  getReservas(): Observable<any> {
    return this.http.get(`${API_URL}/Reservas`);
  }

  getReservasByUser(userId: number): Observable<any> {
    return this.http.get(`${API_URL}/Reservas/User/${userId}`);
  }

  createReserva(reserva: any): Observable<any> {
    return this.http.post(`${API_URL}/Reservas`, reserva);
  }

  updateReserva(id: number, reserva: any): Observable<any> {
    return this.http.put(`${API_URL}/Reservas/${id}`, reserva);
  }

  deleteReserva(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/Reservas/${id}`);
  }

  // CRUD Habitaciones (Admin)
  createHabitacion(habitacion: any): Observable<any> {
    return this.http.post(`${API_URL}/Habitaciones`, habitacion);
  }

  updateHabitacion(id: number, habitacion: any): Observable<any> {
    return this.http.put(`${API_URL}/Habitaciones/${id}`, habitacion);
  }

  deleteHabitacion(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/Habitaciones/${id}`);
  }

  // Validar disponibilidad de habitación
  verificarDisponibilidad(habitacionId: number, fechaEntrada: string, fechaSalida: string): Observable<any> {
    return this.http.get(`${API_URL}/Reservas/VerificarDisponibilidad`, {
      params: {
        habitacionId: habitacionId.toString(),
        fechaEntrada: fechaEntrada,
        fechaSalida: fechaSalida
      }
    });
  }
}
