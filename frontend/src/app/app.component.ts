import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChequeGeneratorComponent } from './components/cheque-generator/cheque-generator.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ChequeGeneratorComponent
  ]
})
export class AppComponent {
  title = 'Cheque Generator';
}
