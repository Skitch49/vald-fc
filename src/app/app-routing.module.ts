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
import { TierlistComponent } from './tierlist/tierlist.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { adminAuthGuard } from './shared/admin-auth.guard';
import { AddDataComponent } from './add-data/add-data.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'clip', component: ClipComponent },
  { path: 'clip/:id', component: PlayerComponent },
  { path: 'interview', component: InterviewComponent },
  { path: 'interview/:id', component: PlayerInterviewComponent },
  { path: 'search', component: SearchComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'my-list', component: MyListComponent, canActivate: [authGuard] },
  { path: 'tier-list', component: TierlistComponent,},
  { path: 'add-data', component: AddDataComponent , canActivate: [adminAuthGuard]}  ,
  { path: 'add-data/:data', component: AddDataComponent , canActivate: [adminAuthGuard]}  ,
  { path: 'dashboard', component: DashboardComponent, canActivate: [adminAuthGuard]},

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
