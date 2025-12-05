import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService} from '@ngx-translate/core';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-navbar',
  imports: [TranslateModule, LogoComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private translate = inject(TranslateService);

  switchLang(){
    if(this.translate.getCurrentLang() == "es")
      this.translate.use('en');
    else
      this.translate.use('es');
  }
}
