import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  isLoading = signal(false);
  errorMessage = signal('');

  login(){
    // Validate
    if(!this.username || !this.password){
      this.errorMessage.set('Porfavor introduce tu usuario y contraseña');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login({username: this.username, password: this.password}).subscribe({
      next: () =>{
        this.isLoading.set(false);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Contraseña o usuario invalido');
        console.error('Error al iniciar sesion:', error);
      }
    });
  }

  home(){
    this.router.navigate(['']);
  }
}
