// Components
import { GalleryItemComponent } from '../../shared/components/gallery/gallery-item.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PaintingService } from '../../services/painting.service';
import { TranslateModule } from '@ngx-translate/core';

import { RouterLink } from "@angular/router";
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [TranslateModule, GalleryItemComponent, NavbarComponent, FooterComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private paintingService = inject(PaintingService);
  
  paintings = toSignal(this.paintingService.getAllPaintings().pipe(
    map(paintings => paintings.slice(0, 6))
  ),{
    initialValue: []
  });
}
