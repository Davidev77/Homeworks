import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrls: ['./contact-item.component.css']
})
export class ContactItemComponent {
  @Input() contact!: Contact;  // dato que recibe del padre
  @Output() delete = new EventEmitter<number>(); // evento que emite hacia arriba

  onDeleteClick(): void {
    this.delete.emit(this.contact.id); 
  }
}