import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EstudiantesService } from '../../services/estudiantes.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.components.html',
  styleUrls: ['./login.components.css']
})
export class LoginComponent {

  email = '';
  password = '';
  error = '';

  constructor(
    private authService: AuthService,
    private estudiantesService: EstudiantesService,
    private router: Router
  ) {}

  async login() {
    this.error = '';

    try {
      const cred = await this.authService.login(this.email, this.password);
      const correo = cred.user.email!;

      const estudiante = await this.estudiantesService.obtenerPorCorreo(correo);

      if (!estudiante) {
        await this.authService.logout();
        this.error = 'Usuario no autorizado';
        return;
      }
        
<<<<<<< HEAD
      
      localStorage.setItem('carrera', estudiante['carrera']);
      localStorage.setItem('yaVoto', estudiante['yaVoto']);
      
=======
      //  GUARDAR LA CARRERA DEL USUARIO
      localStorage.setItem('carrera', estudiante['carrera']);
      localStorage.setItem('yaVoto', estudiante['yaVoto']);
      // redirección por rol
>>>>>>> c541644a8e14792225ba8cc9c4f634e7c8885ab6
     if (estudiante['rol'] === 'admin') {
      this.router.navigate(['/admin']);
      } else {
  this.router.navigate(['/usuario']);
        }

    } catch (err) {
      this.error = 'Correo o contraseña incorrectos';
    }
  }
}