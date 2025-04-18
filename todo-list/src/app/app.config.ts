import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideClientHydration } from '@angular/platform-browser';
import { StorageMap } from '@ngx-pwa/local-storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(BrowserAnimationsModule),
    StorageMap
  ]
};
