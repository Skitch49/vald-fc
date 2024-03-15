import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ApiValdService } from '../services/api-vald.service';
import { ViewportScroller } from '@angular/common';
import { Clip } from '../interface/clip.interface';
import { Observable, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit, AfterViewInit {
  idClip: any;
  clip: any;
  playlist: any;
  safeUrl: any;
  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private apiVald: ApiValdService,
    private viewportScroller: ViewportScroller
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scrollToTop();
    }, 500);
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.idClip = params['id'];
          return this.getPlaylist();
        }),
        switchMap(() => {
          this.shufflePlaylist();
          return this.apiVald.getClipsByUrl(this.idClip);
        })
      )
      .subscribe({
        next: (clip) => {
          this.clip = clip;
          this.initClip();
        },
        error: (error) => {
          console.error('Erreur lors du chargement de la vidéo', error);
          // Gérer l'erreur ici (par exemple, afficher un message à l'utilisateur)
        },
        complete: () => {
          // Logique à exécuter lors de la complétion de l'observable, si nécessaire
          console.log('video bien chargé !')
        },
      });
  }

  private scrollToTop(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  initClip() {
    if (this.idClip) {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${this.idClip}?si=bIxfegmGGYSRY5Wm&autoplay=1&controls=2&showinfo=1&playsinline=0&modestbranding=1&rel=0&iv_load_policy=3&fs=1&loop=1&disablekb=0&playlist=${this.playlist}`
      );
    }
  }

  getPlaylist(): Observable<Clip[]> {
    return this.apiVald.getClips().pipe(
      tap((data) => {
        this.playlist = data
          .filter(
            (clip: Clip) =>
              clip.url !== 'uFnlCzgThS8' && clip.url !== 'vfUFTHAQKeg'
          )
          .map((clip: Clip) => clip.url);
      })
    );
  }

  private shufflePlaylist() {
    for (let i = this.playlist.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.playlist[i], this.playlist[j]] = [
        this.playlist[j],
        this.playlist[i],
      ];
    }
  }
}
