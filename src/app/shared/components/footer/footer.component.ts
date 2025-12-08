import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LogoComponent } from '../logo/logo.component';
import { RouterLink } from '@angular/router';
import { ContactsService } from '../../../services/contacts.service';

@Component({
  selector: 'app-footer',
  imports: [TranslateModule, LogoComponent, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  // Services
  contactService = inject(ContactsService);
}
