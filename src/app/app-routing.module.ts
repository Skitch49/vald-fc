import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PlayerComponent } from './player-clip/player.component';
import { SearchComponent } from './search/search.component';
import { GalleryComponent } from './gallery/gallery.component';
import { MyListComponent } from './my-list/my-list.component';

import { authGuard } from './shared/auth.guard';
import { ClipComponent } from './clip/clip.component';
import { InterviewComponent } from './interview/interview.component';
import { PlayerInterviewComponent } from './player-interview/player-interview.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'clip', component: ClipComponent }, // Assurez-vous d'avoir une route correspondante
  { path: 'clip/:id', component: PlayerComponent }, // Assurez-vous d'avoir une route correspondante
  { path: 'interview', component: InterviewComponent }, // Assurez-vous d'avoir une route correspondante
  { path: 'interview/:id', component: PlayerInterviewComponent }, // Assurez-vous d'avoir une route correspondante
  { path: 'search', component: SearchComponent }, // Assurez-vous d'avoir une route correspondante
  { path: 'gallery', component: GalleryComponent }, // Assurez-vous d'avoir une route correspondante
  { path: 'my-list', component: MyListComponent, canActivate: [authGuard] }, // Assurez-vous d'avoir une route correspondante
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
