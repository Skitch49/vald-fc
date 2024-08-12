import { Component, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiValdService } from '../services/api-vald.service';
import { Clip } from '../interface/clip.interface';
import { Periode } from '../interface/periode.interface';
import { PeriodeData } from '../interface/periodeData.interface';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { GoogleApiService } from '../services/google-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  clips!: Clip;
  lastClip: any;
  isMobileScreen: boolean = false;
  userId: string | null = null;
  categories: any[] = [
    "L'ère V",
    'Post CMEC',
    'Post Xeu',
    'Concert',
    'Post Agartha',
    'Post NQNT 2',
    'Entertainment',
    'NQNT - NQNTMQMQMB',
    'Amin & Hugo',
    'Interview V',
    'VALD sur Twitch',
    'Documentaires | Courts métrages',
    'Documentaires | Fan made',
    'Interview Ce Monde Est Cruel',
    'Interview Horizon Vertical',
    'Interview Échelon',
    'Interview Xeu'
  ];
  VideoByCategories: any[] = [];

  isMuted: boolean = true;

  constructor(
    private apiVald: ApiValdService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private readonly google: GoogleApiService
  ) {
    this.checkScreenSize();
  }

  randomSort() {
    return Math.random() - 0.5;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.updateSafeUrl();

    if (typeof window !== 'undefined' && window.document) {
      localStorage.setItem('mute', this.isMuted.toString());
    }
  }

  getAllVideosByCategory() {
    this.categories.forEach((category) => {
      this.apiVald.getAllVideoByCategory(category).subscribe((data) => {
        // Utilisez les données comme nécessaire, par exemple, stockez-les dans un objet avec le titre de la période
        const VideoOnCategorie: PeriodeData = { title: category, clips: data };
        // Ajoutez periodDatum au tableau periodData
        this.VideoByCategories.push(VideoOnCategorie);
        // Faites ce dont vous avez besoin avec periodData
      });
    });
    console.log(this.VideoByCategories);
  }

  ngOnInit() {
    this.categories.sort(this.randomSort);
    this.userId = this.google.getUserId();

    if (typeof window !== 'undefined' && window.document) {
      const muteValue = localStorage.getItem('mute');
      if (muteValue) {
        this.isMuted = muteValue === 'true'; // Convertissez la chaîne en booléen
        this.updateSafeUrl();
      }
      this.getAllVideosByCategory();
    }

    this.getLastClip();
  }

  ClipIsLiked() {
    // récupère id de l'utilisateur
    if (this.userId) {
      //récupère les clips like par l'utilisateur
      this.apiVald.getClipsLiked(this.userId).subscribe();
    }
  }

  getLastClip() {
    this.apiVald.getLastClip().subscribe((data) => {
      this.lastClip = data;
      const safeUrl: SafeResourceUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${this.lastClip.url}?si=bIxfegmGGYSRY5Wm&controls=0&showinfo=0&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&loop=1&playlist=${this.lastClip.url}&disablekb=1&enablejsapi=1&autoplay=1&mute=${this.isMuted}`
        );
      this.lastClip.safeUrl = safeUrl;
    });
  }

  updateSafeUrl() {
    if (this.lastClip) {
      const safeUrl: SafeResourceUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${this.lastClip.url}?si=bIxfegmGGYSRY5Wm&controls=0&showinfo=0&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&loop=1&playlist=${this.lastClip.url}&disablekb=1&enablejsapi=1&autoplay=1&mute=${this.isMuted}`
        );
      this.lastClip.safeUrl = safeUrl;
    }
  }

  openDialog(clip: any, userId: string | null) {
    if (clip.artiste) {
      const typeVideo = 'Clip';
      const dialogConfig = {
        width: this.isMobileScreen ? '99vw' : '48vw',
        height: 'auto',
        maxHeight: '95vh',
        data: { clip: clip, userId: userId, typeVideo: typeVideo },
      };
      this.dialog.open(DialogComponent, dialogConfig);
    }
    if (clip.author) {
      const typeVideo = 'Interview';

      const dialogConfig = {
        width: this.isMobileScreen ? '99vw' : '48vw',
        height: 'auto',
        maxHeight: '95vh',
        data: { clip: clip, userId: userId, typeVideo: typeVideo },
      };
      this.dialog.open(DialogComponent, dialogConfig);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 768) {
        this.isMobileScreen = true;
      } else {
        this.isMobileScreen = false;
      }
      console.log(this.isMobileScreen);
    }
  }
}
