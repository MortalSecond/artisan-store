import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";

@Component({
  selector: 'app-commission',
  imports: [TranslateModule, NavbarComponent],
  templateUrl: './commission.component.html',
  styleUrl: './commission.component.css'
})
export class CommissionComponent {

}
