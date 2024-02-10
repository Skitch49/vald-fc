import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SwiperComponent } from './swiper/swiper.component';

import { MaterialModule } from './shared/module/material/material.module';
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { PlayerComponent } from './player/player.component';
import { SwiperDirective } from './shared/directives/swiper.directive';
import { DialogComponent } from './shared/components/dialog/dialog.component';
// register Swiper custom elements
register();

//Local
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { TooltipComponent } from './tooltip/tooltip.component';
registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    SwiperComponent,
    PlayerComponent,
    SwiperDirective,
    DialogComponent,
    TooltipComponent
  ],
  imports: [BrowserModule, AppRoutingModule,MaterialModule],
  providers: [provideClientHydration(), provideHttpClient(withFetch()), { provide: LOCALE_ID, useValue: "fr-FR" }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
