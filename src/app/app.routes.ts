import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home/home.component';
import { GalleryComponent } from './pages/gallery/gallery/gallery.component';
import { CommissionComponent } from './pages/commission/commission/commission.component';
import { ContactComponent } from './pages/contact/contact/contact.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'gallery', component: GalleryComponent},
    {path: 'commission', component: CommissionComponent},
    {path: 'contact', component: ContactComponent},
    {path: '**', redirectTo: ''}
];
