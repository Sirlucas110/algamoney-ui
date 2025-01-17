import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [MessageModule, CommonModule],
  template: `
    <p-message 
      *ngIf="temErro()" 
      severity="error" 
      [text]="text">
    </p-message>

  `
})
export class MessageComponent {

  @Input() error: string = '';
  @Input() control: any;
  @Input() text: string = '';

  temErro(): boolean{
    return this.control.hasError(this.error) && this.control.dirty
  }
}
