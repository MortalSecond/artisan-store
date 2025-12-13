import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { CommissionComponent } from './pages/commission/commission.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/admin/login/login.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'gallery', component: GalleryComponent},
    {path: 'commission', component: CommissionComponent},
    {path: 'contact', component: ContactComponent},

    // Admin Routes
    {path: 'admin/login', component: LoginComponent},
    {
        path: 'admin/dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
    },
    
    {path: '**', redirectTo: ''},
];
