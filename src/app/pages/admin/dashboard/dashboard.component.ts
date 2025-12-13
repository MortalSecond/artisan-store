import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Painting } from '../../../shared/models/painting';
import { PaintingService } from '../../../services/painting.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent{
  // Services
  authService = inject(AuthService);
  paintingService = inject(PaintingService);
  router = inject(Router);

  // Signals
  paintings = toSignal(this.paintingService.getAllPaintings(),{
    initialValue: []
  });

  logout(){
    this.authService.logout();
    this.router.navigate(['admin/login']);
  }
}
