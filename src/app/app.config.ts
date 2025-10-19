import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router'; 
//Zamenjuje stari RouterModule.forRoot(routes)

import { provideHttpClient } from '@angular/common/http';
//omogućava HTTP zahteve , zamenjuje stari HttpClientModule

import { routes } from './app.routes'; // rute iz app.routes.ts

export const appConfig: ApplicationConfig = {
  providers: [  // funkcionalnosti dostupne u CELOJ aplikaciji
    provideRouter(routes),  
    provideHttpClient()
  ]
};