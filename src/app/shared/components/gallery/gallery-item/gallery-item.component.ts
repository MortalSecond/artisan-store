import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Painting } from '../../../models/painting';

@Component({
  selector: 'app-gallery-item',
  imports: [TranslateModule],
  templateUrl: './gallery-item.component.html',
  styleUrl: './gallery-item.component.css'
})
export class GalleryItemComponent {
  @Input() painting!: Painting;
}
