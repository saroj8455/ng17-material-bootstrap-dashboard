import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// 1. IMPORT THE LOADER
// import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';

// 2. INITIALIZE IT IMMEDIATELY
// jeepSqlite(window);

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
