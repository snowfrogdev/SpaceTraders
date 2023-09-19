import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-noop',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      noop works!
    </p>
  `,
  styles: [
  ]
})
export class NoopComponent {

}
