import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PaintingService } from '../../services/painting.service';
import { TranslateModule } from '@ngx-translate/core';

// Components
import { GalleryItemComponent } from '../../shared/components/gallery/gallery-item.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-home',
  imports: [TranslateModule, GalleryItemComponent, NavbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private paintingService = inject(PaintingService);
  
  paintings = toSignal(this.paintingService.getAllPaintings(),{
    initialValue: []
  });
}
