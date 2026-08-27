import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoaderComponent} from './components/loader/loader.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { ContactItemComponent } from './components/contact-item/contact-item.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule,
    AppComponent,
    LoaderComponent,
    ContactFormComponent,
    ContactListComponent,
    ContactItemComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}