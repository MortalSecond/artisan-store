import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LogoComponent } from "../../logo/logo.component";

@Component({
  selector: 'app-footer',
  imports: [TranslateModule, LogoComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
