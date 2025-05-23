import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenHTTPInterceptor } from './app/core/token-http-interceptor';
const mergedAppConfig = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideAnimations(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([tokenHTTPInterceptor])),
  ],
};
bootstrapApplication(AppComponent, mergedAppConfig).catch((err) =>
  console.error(err)
);
