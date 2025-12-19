import { Component, inject, signal } from '@angular/core';
import { TranslateModule, TranslateService} from '@ngx-translate/core';
import { LogoComponent } from '../logo/logo.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [TranslateModule, LogoComponent, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  // Services
  private translate = inject(TranslateService);

  // Signals
  mobileMenuOpen = signal(false);

  // Functional Methods
  switchLang(){
    if(this.translate.getCurrentLang() == "es")
      this.translate.use('en');
    else
      this.translate.use('es');
  }

  // UI Methods
  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }
  
  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }
}
