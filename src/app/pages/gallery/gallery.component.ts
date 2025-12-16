import { Component, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PaintingService } from '../../services/painting.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { GalleryItemComponent } from '../../shared/components/gallery/gallery-item.component';
import { finalize } from 'rxjs';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-gallery',
  imports: [TranslateModule, GalleryItemComponent, LoadingSpinnerComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {
  private paintingsService = inject(PaintingService);
  isLoading = signal(true);

  paintings = toSignal(this.paintingsService.getAllPaintings().pipe(finalize(()=>this.isLoading.set(false))),{
    initialValue:[]
  });
}
