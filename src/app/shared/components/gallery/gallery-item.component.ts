import { Component, Input, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Painting } from '../../models/painting';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-gallery-item',
  imports: [TranslateModule, DecimalPipe, RouterLink],
  templateUrl: './gallery-item.component.html',
  styleUrl: './gallery-item.component.css'
})
export class GalleryItemComponent {
  @Input() painting!: Painting;
  isPaintingInformationVisible = signal(false);
  isPaintingAvailable = signal(true);

  ngOnInit(){
    if(this.painting.available == false)
      this.isPaintingAvailable.set(false);
  }

  showPaintingInformation(){
    this.isPaintingInformationVisible.set(true);
  }

  hidePaintingInformation(){
    this.isPaintingInformationVisible.set(false);
  }


}
