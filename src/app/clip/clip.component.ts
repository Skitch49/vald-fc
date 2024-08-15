import { Component, HostListener } from '@angular/core';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PeriodeData } from '../interface/periodeData.interface';
import { ApiValdService } from '../services/api-vald.service';
import { MatDialog } from '@angular/material/dialog';
import { GoogleApiService } from '../services/google-api.service';
import { Periode } from '../interface/periode.interface';
import { Clip } from '../interface/clip.interface';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrl: './clip.component.scss',
})
export class ClipComponent {
  clips!: Clip;
  lastClip: any;
  dateRange: Clip[] = [];
  isMobileScreen: boolean = false;
  likedClipIds: Set<string> = new Set();
  userId: string | null = null;
  categories: any[] = [
    'L\'ère V',
    'Post CMEC',
    'Post Xeu',
    'Post Agartha',
    'Post NQNT 2',
    'NQNT - NQNTMQMQMB',
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

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    if (
      window.scrollY + window.innerHeight + 120 >=
      document.body.offsetHeight
    ) {
      this.loadMoreClips();
    }
  }

  loadMoreClips() {
    const newClips = this.VideoByCategories.splice(
      this.displayedCategories.length,
      this.displayedCategories.length + this.categoriesLoaded
    );
    this.displayedCategories.push(...newClips);
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

    this.getLastClip();
    this.getClipsByCategory();
  }

  getClipsByCategory(){
    this.categories.forEach((category,index) =>{
      this.apiVald.getAllVideoByCategory(category).subscribe( (data) =>{
        const ClipOnCategorie: PeriodeData = { title: category, clips: data };
        this.VideoByCategories.push(ClipOnCategorie);

        if(index < this.categoriesLoaded){
          this.displayedCategories.push(ClipOnCategorie);
        }

      })
    })
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
    const dialogConfig = {
      width: this.isMobileScreen ? '99vw' : '48vw',
      height: 'auto',
      maxHeight: '95vh',
      data: { clip: clip, userId: userId, typeVideo: 'Clip' },
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
