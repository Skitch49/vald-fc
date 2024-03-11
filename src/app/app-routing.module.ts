import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PlayerComponent } from './player/player.component';
import { SearchComponent } from './search/search.component';
import { GalleryComponent } from './gallery/gallery.component';
import { MyListComponent } from './my-list/my-list.component';

import { GoogleApiService } from './services/google-api.service';
import { authGuard } from './shared/auth.guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  { path: 'clip/:id', component: PlayerComponent }, // Assurez-vous d'avoir une route correspondante
  { path: 'search', component: SearchComponent }, // Assurez-vous d'avoir une route correspondante
  { path: 'gallery', component: GalleryComponent }, // Assurez-vous d'avoir une route correspondante
  { path: 'my-list', component: MyListComponent, canActivate: [authGuard]  }, // Assurez-vous d'avoir une route correspondante
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
