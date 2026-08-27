import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Contact } from './models/contact.model';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { LoaderComponent } from './components/loader/loader.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ContactFormComponent, ContactListComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Mis Contactos';

  loading = signal(true);
  contacts = signal<Contact[]>([]);

  private nextId = 1;

  ngOnInit(): void {
    this.loadInitialContacts();
  }

  // Simula la carga de datos 
  loadInitialContacts(): void {
    setTimeout(() => {
      this.contacts.set([
        { id: this.nextId++, name: 'Christian Home', phone: '300 123 4567' },
        { id: this.nextId++, name: 'Jonathan López', phone: '310 987 6543' },
        { id: this.nextId++, name: 'Daniel Acosta', phone: '320 456 1234' }
      ]);
      this.loading.set(false);
    }, 2000); // 2 segundos de carga
  }

  // Escucha el evento (addContact) que emite ContactFormComponent
  onAddContact(newContact: { name: string; phone: string }): void {
    const contact: Contact = {
      id: this.nextId++,
      name: newContact.name,
      phone: newContact.phone
    };
    this.contacts.update(contacts => [...contacts, contact]);
  }

  // Escucha el evento (deleteContact) que emite ContactListComponent
  onDeleteContact(id: number): void {
    this.contacts.update(contacts => contacts.filter(c => c.id !== id));
  }
}