import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PaintingService } from './services/painting.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('artisan-store-v2');
  private translate = inject(TranslateService);
  private paintingService = inject(PaintingService);
  
  paintings = toSignal(this.paintingService.getAllPaintings(),{
    initialValue: []
  });

  constructor(){
    this.translate.addLangs(['es', 'en']);
    this.translate.setFallbackLang('es');
    this.translate.use('es');
  }

  switchLang(){
    if(this.translate.getCurrentLang() == "es")
      this.translate.use('en');
    else
      this.translate.use('es');
  }
}
