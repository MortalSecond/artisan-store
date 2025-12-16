import { Component, computed, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PaintingService } from '../../services/painting.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { GalleryItemComponent } from '../../shared/components/gallery/gallery-item.component';
import { finalize } from 'rxjs';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

type SizeFilter = 'all' | 'small' | 'medium' | 'large';
type PriceFilter = 'all' | 'under-500' | '500-1000' | 'over-1000';

@Component({
  selector: 'app-gallery',
  imports: [TranslateModule, GalleryItemComponent, LoadingSpinnerComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {
  private paintingsService = inject(PaintingService);
  isLoading = signal(true);
  selectedSize = signal<SizeFilter>('all');
  selectedPrice = signal<PriceFilter>('all');

  allPaintings = toSignal(this.paintingsService.getAllPaintings().pipe(finalize(()=>this.isLoading.set(false))),{
    initialValue:[]
  });

  // Filtered Paintings
  paintings = computed(() => { 
    let filtered = this.allPaintings()

    // Filter By Size
    const size = this.selectedSize();
    if(size !== 'all'){
      filtered = filtered.filter(p=>{
        const largestDimension = Math.max(p.height || 0, p.width || 0);

        switch(size){
          case 'small': return largestDimension <= 40;
          case 'medium': return largestDimension > 40 && largestDimension <= 120;
          case 'large': return largestDimension > 120;
          default: return true;
        }
      });
    }

    const price = this.selectedPrice();
    if(price !== 'all'){
      filtered = filtered.filter(p=>{
        const paintingPrice = p.price || 0;

        switch(price){
          case 'under-500': return paintingPrice < 500;
          case '500-1000': return paintingPrice >= 500 && paintingPrice <= 1000;
          case 'over-1000': return paintingPrice > 1000;
          default: return true;
        }
      });
    }

    return filtered;
  });
  

  // UI Methods
  onSizeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedSize.set(select.value as SizeFilter);
  }

  onPriceChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedPrice.set(select.value as PriceFilter);
  }
}
