import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ApiValdService } from '../services/api-vald.service';
import { ViewportScroller } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit, OnDestroy {
  idClip: any;
  clip: any;
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
      this.idClip = params['id'];
      this.getPlaylist();
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

  initClip() {
    if (this.idClip) {
      const url = `https://www.youtube.com/embed/${this.idClip}?si=bIxfegmGGYSRY5Wm&autoplay=1&controls=2&showinfo=1&playsinline=0&modestbranding=1&rel=0&iv_load_policy=3&fs=1&loop=1&disablekb=0&playlist=${this.playlist}`;
      this.apiVald.updateSafeUrl(url);
    }
  }

  getPlaylist(): void {
    this.apiVald.getClips().subscribe((data) => {
      this.playlist = data
        .filter(
          (clip: any) =>
            clip.url !== 'uFnlCzgThS8' && clip.url !== 'vfUFTHAQKeg'
        )
        .sort((a: any, b: any) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        })
        .map((clip: any) => clip.url);
      this.apiVald.getClipsByUrl(this.idClip).subscribe({
        next: (clip) => {
          this.clip = clip;
          this.initClip();
        },
        error: (error) => {
          console.error('Erreur lors du chargement de la vidéo', error);
        },
      });
    });
  }
}
