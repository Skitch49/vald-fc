import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiValdService } from '../services/api-vald.service';

@Component({
  selector: 'app-player-interview',
  templateUrl: './player-interview.component.html',
  styleUrl: './player-interview.component.scss',
})
export class PlayerInterviewComponent implements OnInit, OnDestroy {
  idVideo: any;
  video: any;
  playlist: any;
  safeUrl: SafeResourceUrl = '';
  private safeUrlSubscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private apiVald: ApiValdService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.idVideo = params['id'];
      this.InitVideo();
    });

    this.safeUrlSubscription = this.apiVald.getSafeUrl().subscribe((url) => {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
  }

  ngOnDestroy(): void {
    if (this.safeUrlSubscription) {
      this.safeUrlSubscription.unsubscribe();
    }
  }

  loadVideo() {
    if (this.idVideo) {
      const url = `https://www.youtube.com/embed/${this.idVideo}?si=bIxfegmGGYSRY5Wm&autoplay=1&controls=2&showinfo=1&playsinline=0&modestbranding=1&rel=0&iv_load_policy=3&fs=1&loop=1&disablekb=0&playlist=${this.playlist}`;
      console.log(url)
      this.apiVald.updateSafeUrl(url);
    }
  }

  async InitVideo(): Promise<void> {
    try {
      this.video = await this.apiVald.getVideoByUrl(this.idVideo).toPromise();
      await this.getPlaylist();
      this.loadVideo();
    } catch (error) {
      console.error('Erreur lors du chargement de la vidéo', error);
    }
  }
  
  async getPlaylist(): Promise<void> {
    try {
      const data = await this.apiVald.getVideosByCategory(this.video.categorie).toPromise();
      this.playlist = data.map((video: any) => video.url);
    } catch (error) {
      console.error('Erreur lors de la récupération de la playlist', error);
    }
  }
}
