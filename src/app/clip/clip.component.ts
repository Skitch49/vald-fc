import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PeriodeData } from '../interface/periodeData.interface';
import { ApiValdService } from '../services/api-vald.service';
import { MatDialog } from '@angular/material/dialog';
import { GoogleApiService } from '../services/google-api.service';
import { Clip } from '../interface/clip.interface';
import { forkJoin, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrl: './clip.component.scss',
})
export class ClipComponent implements OnInit, OnDestroy {
  clips!: Clip;
  lastClip: any;
  dateRange: Clip[] = [];
  isMobileScreen: boolean = false;
  likedClipIds: Set<string> = new Set();
  userId: string | null = null;
  categories: any[] = [
    "L'ère V",
    'Post CMEC',
    'Post Xeu',
    'Post Agartha',
    'Post NQNT 2',
    'NQNT - NQNTMQMQMB',
  ];
  VideoByCategories: PeriodeData[] = [];
  private subscriptions: Subscription = new Subscription();

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
    if (typeof window !== 'undefined' && window.document) {
      if (window.innerWidth < 715) {
        if (
          window.innerHeight + window.scrollY + 350 >=
            document.body.offsetHeight &&
          this.displayedCategories.length < this.VideoByCategories.length
        ) {
          this.loadMoreClips();
        }
      } else if (
        window.scrollY + window.innerHeight + 120 >=
          document.body.offsetHeight &&
        this.displayedCategories.length < this.VideoByCategories.length
      ) {
        console.log(`--------------------------------------`);
        console.log(`diplay: ${this.displayedCategories.length}`);
        console.log(`cat: ${this.VideoByCategories.length}`);
        this.loadMoreClips();
      }
    }
  }

  loadMoreClips() {
    const startIndex = this.displayedCategories.length;
    console.log(`lengthDisplay: ${this.displayedCategories.length}`);

    const newClips: any[] = this.VideoByCategories.slice(
      startIndex,
      startIndex + this.categoriesLoaded
    );
    console.log(`newClips 1: ${JSON.stringify(newClips[0].title)}`);
    console.log(`newClips 2: ${JSON.stringify(newClips[1].title)}`);

    newClips.forEach((newClip) => {
      const alreadyExists = this.displayedCategories.some(
        (displayedClip) => displayedClip.title === newClip.title
      );

      if (!alreadyExists) {
        this.displayedCategories.push(newClip);
      }
    });
    let i = 0;
    this.displayedCategories.forEach((displayCategory) => {
      i++;
      console.log(`display${i}: ${JSON.stringify(displayCategory.title)}`);
    });
  }
  toggleMute() {
    this.isMuted = !this.isMuted;
    this.updateSafeUrl();

    if (typeof window !== 'undefined' && window.document) {
      localStorage.setItem('mute', this.isMuted.toString());
    }
  }

  checkCategorieLoadded() {
    if (typeof window !== 'undefined' && window.document) {
      if (window.innerWidth < 715) {
        this.categoriesLoaded = 3;
      }
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
    this.checkCategorieLoadded();

    this.getLastClip();
    this.getClipsByCategory();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  getClipsByCategory() {
    const categoryRequests = this.categories.map((category) =>
      this.apiVald
        .getAllVideoByCategory(category)
        .pipe(map((data) => ({ title: category, clips: data })))
    );

    forkJoin(categoryRequests).subscribe(
      (results: PeriodeData[]) => {
        this.VideoByCategories = results;
        this.displayedCategories = this.VideoByCategories.slice(
          0,
          this.categoriesLoaded
        );
      },
      (error) => {
        console.error('Erreur chargement des clips par categorie:', error);
      }
    );
  }

  ClipIsLiked() {
    // récupère id de l'utilisateur
    if (this.userId) {
      //récupère les clips like par l'utilisateur
      const sub = this.apiVald.getClipsLiked(this.userId).subscribe();
      this.subscriptions.add(sub);
    }
  }

  getLastClip() {
    const sub = this.apiVald.getLastClip().subscribe((data) => {
      this.lastClip = data;
      const safeUrl: SafeResourceUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${this.lastClip.url}?si=bIxfegmGGYSRY5Wm&controls=0&showinfo=0&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&loop=1&playlist=${this.lastClip.url}&disablekb=1&enablejsapi=1&autoplay=1&mute=${this.isMuted}`
        );
      this.lastClip.safeUrl = safeUrl;
    });
    this.subscriptions.add(sub);
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
    }
  }
}
