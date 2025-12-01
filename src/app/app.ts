import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('artisan-store-v2');
  private translate = inject(TranslateService);

  constructor(){
    this.translate.addLangs(['es', 'en']);
    this.translate.setFallbackLang('es');
    this.translate.use('es');
  }
}
