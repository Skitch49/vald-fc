import { Component, HostListener } from '@angular/core';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PeriodeData } from '../interface/periodeData.interface';
import { GoogleApiService } from '../services/google-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiValdService } from '../services/api-vald.service';
import { Periode } from '../interface/periode.interface';
import { Clip } from '../interface/clip.interface';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrl: './interview.component.scss',
})
export class InterviewComponent {
  clips!: Clip;
  lastVideo: any;
  dateRange: Clip[] = [];
  isMobileScreen: boolean = false;
  likedClipIds: Set<string> = new Set();
  userId: string | null = null;
  categories: any[] = [
    'Entertainment',
    'Concert',
    'Amin & Hugo',
    'Interview V',
    'VALD sur Twitch',
    'Documentaires | Courts métrages',
    'Documentaires | Fan made',
    'Interview Ce Monde Est Cruel',
    'Interview Horizon Vertical',
    'Interview Échelon',
    'Interview Xeu',
    'Interview Agartha',
    'Interview NQNT 2',
    'Interview NQNT',
  ];
  VideoByCategories: any[] = [];
  isMuted: boolean = true;
  displayedCategories: any[] = [];
  categoriesLoaded: number = 2; // Nombre initial de catégories à charger

  constructor(
    private apiVald: ApiValdService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private readonly google: GoogleApiService
  ) {
    this.checkScreenSize();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.updateSafeUrl();

    if (typeof window !== 'undefined' && window.document) {
      localStorage.setItem('mute', this.isMuted.toString());
    }
  }

  ngOnInit() {
    this.userId = this.google.getUserId();

    if (typeof window !== 'undefined' && window.document) {
      const muteValue = localStorage.getItem('mute');
      if (muteValue) {
        this.isMuted = muteValue === 'true'; // Convertissez la chaîne en booléen
        this.updateSafeUrl();
      }
    }

    this.getLastVideo();

    this.getVideosByCategory();
    console.log('categorie:' + this.categories);
    console.log('VideoByCategories:' + JSON.stringify(this.VideoByCategories));
  }

  ClipIsLiked() {
    // récupère id de l'utilisateur
    if (this.userId) {
      //récupère les clips like par l'utilisateur
      this.apiVald.getClipsLiked(this.userId).subscribe();
    }
  }

  getLastVideo() {
    this.apiVald.getLastVideo().subscribe((data) => {
      this.lastVideo = data;
      const safeUrl: SafeResourceUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${this.lastVideo.url}?si=bIxfegmGGYSRY5Wm&controls=0&showinfo=0&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&loop=1&playlist=${this.lastVideo.url}&disablekb=1&enablejsapi=1&autoplay=1&mute=${this.isMuted}`
        );
      this.lastVideo.safeUrl = safeUrl;
    });
  }

  getVideosByCategory() {
    this.categories.forEach((category, index) => {
      this.apiVald.getVideosByCategory(category).subscribe((data) => {
        // Utilisez les données comme nécessaire, par exemple, stockez-les dans un objet avec le titre de la période
        const VideoOnCategorie: PeriodeData = { title: category, clips: data };
        // Ajoutez periodDatum au tableau periodData
        this.VideoByCategories.push(VideoOnCategorie);
        // Faites ce dont vous avez besoin avec periodData
        if (index < this.categoriesLoaded) {
          this.displayedCategories.push(VideoOnCategorie);
        }
      });
    });
  }

  updateSafeUrl() {
    if (this.lastVideo) {
      const safeUrl: SafeResourceUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${this.lastVideo.url}?si=bIxfegmGGYSRY5Wm&controls=0&showinfo=0&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&loop=1&playlist=${this.lastVideo.url}&disablekb=1&enablejsapi=1&autoplay=1&mute=${this.isMuted}`
        );
      this.lastVideo.safeUrl = safeUrl;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    if (
      window.innerHeight + window.scrollY + 120 >=
      document.body.offsetHeight
    ) {
      this.loadMoreCategories();
    }
  }

  loadMoreCategories() {
    const remainingCategories = this.VideoByCategories.slice(
      this.displayedCategories.length,
      this.displayedCategories.length + this.categoriesLoaded
    );
    this.displayedCategories.push(...remainingCategories);
  }

  openDialog(clip: any, userId: string | null) {
    const dialogConfig = {
      width: this.isMobileScreen ? '99vw' : '48vw',
      height: 'auto',
      maxHeight: '95vh',
      data: { clip: clip, userId: userId, typeVideo: 'Interview' },
    };
    this.dialog.open(DialogComponent, dialogConfig);
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
