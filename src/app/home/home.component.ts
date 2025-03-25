import { Component, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiValdService } from '../services/api-vald.service';
import { Clip } from '../interface/clip.interface';
import { Periode } from '../interface/periode.interface';
import { PeriodeData } from '../interface/periodeData.interface';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { GoogleApiService } from '../services/google-api.service';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

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
  videoByCategories: PeriodeData[] = [];
  displayVideo: any[] = [];
  categoriesLoaded: number = 2;
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

  checkCategorieLoadded() {
    if (typeof window !== 'undefined' && window.document) {
      if (window.innerWidth < 715) {
        this.categoriesLoaded = 3;
      }
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (typeof window !== 'undefined' && window.document) {
      if (window.innerWidth < 715) {
        if (
          window.innerHeight + window.scrollY + 350 >=
            document.body.offsetHeight &&
          this.displayVideo.length < this.videoByCategories.length
        ) {
          this.addVideo();
        }
      } else if (
        window.innerHeight + window.scrollY + 120 >=
          document.body.offsetHeight &&
        this.displayVideo.length < this.videoByCategories.length
      ) {
        console.log(
          `diplay: ${this.displayVideo.length}  Categorie : ${this.videoByCategories.length}`
        );
        this.addVideo();
      }
    }
  }

  addVideo() {
    const newVideoDisplay = this.videoByCategories.slice(
      this.displayVideo.length,
      this.displayVideo.length + this.categoriesLoaded
    );

    newVideoDisplay.forEach((newVideo) => {
      // Vérifiez si une vidéo avec le même titre existe déjà
      const alreadyExists = this.displayVideo.some(
        (displayedClip) =>
          displayedClip.title.trim().toLowerCase() ===
          newVideo.title.trim().toLowerCase()
      );

      if (!alreadyExists) {
        this.displayVideo.push(newVideo);
      } else {
        console.log(`La catégorie "${newVideo.title}" existe déjà. Ignorée.`);
      }
    });
  }
  toggleMute() {
    this.isMuted = !this.isMuted;
    this.updateSafeUrl();

    if (typeof window !== 'undefined' && window.document) {
      sessionStorage.setItem('mute', this.isMuted.toString());
    }
  }

  getAllVideosByCategory() {
    const storedData = sessionStorage.getItem('allContent');

    if (storedData) {
      console.log('Récupération le sessionStorage...');

      try {
        this.videoByCategories = this.groupVideosByCategory(
          JSON.parse(storedData)
        );
        this.videoByCategories.sort(this.randomSort);
        this.displayVideo = this.videoByCategories.slice(
          0,
          this.categoriesLoaded
        );
        return;
      } catch (error) {
        console.warn('Données corrompues dans le sessionStorage, suppression...');
        sessionStorage.removeItem('allContent');
      }
    } else {
      console.log("Récupération des vidéos depuis l'API...");
      this.apiVald.getAllContent().subscribe({
        next: (videos: any[]) => {
          this.getTypeContent(videos);
          sessionStorage.setItem('allContent', JSON.stringify(videos));

          this.videoByCategories = this.groupVideosByCategory(videos);
          this.videoByCategories.sort(this.randomSort);
          this.displayVideo = this.videoByCategories.slice(
            0,
            this.categoriesLoaded
          );
        },
        error: (error) => {
          console.error('Erreur lors du chargement des vidéos:', error);
        },
      });
    }
  }

  private groupVideosByCategory(videos: any[]): PeriodeData[] {
    const categoryMap = new Map<string, any[]>();

    videos.forEach((video) => {
      if (!categoryMap.has(video.categorie)) {
        categoryMap.set(video.categorie, []);
      }
      categoryMap.get(video.categorie)?.push(video);
    });

    return Array.from(categoryMap.entries()).map(([title, clips]) => ({
      title,
      clips,
    }));
  }

  getTypeContent(videos: any[]) {
    videos.forEach((clip) => {
      clip.type = clip.author ? 'interview' : 'clip';
    });
  }

  ngOnInit() {
    this.userId = this.google.getUserId();
    this.checkCategorieLoadded();
    if (typeof window !== 'undefined' && window.document) {
      const muteValue = sessionStorage.getItem('mute');
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
    const storage = sessionStorage.getItem('lastClip');
    if (storage) {
     this.lastClip = JSON.parse(storage);
     this.updateSafeUrl()

    } else {
      this.apiVald.getLastClip().subscribe((data) => {
        this.lastClip = data;
        const safeUrl: SafeResourceUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.youtube.com/embed/${this.lastClip.url}?si=bIxfegmGGYSRY5Wm&controls=0&showinfo=0&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&loop=1&playlist=${this.lastClip.url}&disablekb=1&enablejsapi=1&autoplay=1&mute=${this.isMuted}`
          );
        this.lastClip.safeUrl = safeUrl;
        sessionStorage.setItem('lastClip',JSON.stringify(this.lastClip));
      });
    }
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
