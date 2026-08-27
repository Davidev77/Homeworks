import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  imports: [FormsModule],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent {
  name: string = '';
  phone: string = '';

  @Output() addContact = new EventEmitter<{ name: string; phone: string }>();

  onSubmit(): void {
    if (this.name.trim() === '' || this.phone.trim() === '') {
      return; // validación
    }
    this.addContact.emit({ name: this.name, phone: this.phone });
    this.name = '';
    this.phone = '';
  }
}