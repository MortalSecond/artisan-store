import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  username = '';
  password = '';
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    // Check If Redirected Due To Expired Token
    this.route.queryParams.subscribe(params=>{
      if (params['expired'] === 'true'){
        this.errorMessage.set("Tu sesion ha expirado. Inicia sesion de nuevo.");
      }
    });
  }

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

        if (error.status === 401)
          this.errorMessage.set('Usuario o contraseña incorrectos');
        else 
          this.errorMessage.set('Error al iniciar sesión. Intenta de nuevo.');

        console.error('Error al iniciar sesion:', error);
      }
    });
  }

  home(){
    this.router.navigate(['']);
  }
}
