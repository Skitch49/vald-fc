import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PlayerComponent } from './player/player.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  { path: 'clip/:id', component: PlayerComponent }, // Assurez-vous d'avoir une route correspondante
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
