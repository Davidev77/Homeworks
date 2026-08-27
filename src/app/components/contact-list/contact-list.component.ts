import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contact } from '../../models/contact.model';
import { ContactItemComponent } from '../contact-item/contact-item.component';

@Component({
  selector: 'app-contact-list',
  imports: [CommonModule, ContactItemComponent],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})

export class ContactListComponent {
  @Input() contacts: Contact[] = [];
  @Output() deleteContact = new EventEmitter<number>();

  onDelete(id: number): void {
    this.deleteContact.emit(id); // reenvía el evento que le llegó del hijo
  }
}