import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { getApp } from 'firebase/app';
import { provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { routes } from './app.routes';
import '../firebase/config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => getApp()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
