import { Component } from '@angular/core';
import { PersonFormComponent, NewPersonRequest } from './person-form/person-form.component';
import { PersonListComponent } from './person-list/person-list.component';
import { PersonQueueService } from './services/person-queue.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PersonFormComponent, PersonListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private personQueue: PersonQueueService) {}

  get people() {
    return this.personQueue.people();
  }

  onPersonSubmitted(request: NewPersonRequest): void {
    this.personQueue.addPerson(request.name, request.withdrawalAmount);
  }

  onServeNext(): void {
    this.personQueue.serveNext();
  }
}
