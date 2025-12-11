import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PaintingService } from '../../services/painting.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { GalleryItemComponent } from '../../shared/components/gallery/gallery-item.component';

@Component({
  selector: 'app-gallery',
  imports: [TranslateModule, GalleryItemComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {
  private paintingsService = inject(PaintingService);

  paintings = toSignal(this.paintingsService.getAllPaintings(),{
    initialValue:[]
  });
}
