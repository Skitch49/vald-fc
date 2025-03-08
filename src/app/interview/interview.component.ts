import { Component, HostListener } from '@angular/core';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PeriodeData } from '../interface/periodeData.interface';
import { GoogleApiService } from '../services/google-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiValdService } from '../services/api-vald.service';
import { Periode } from '../interface/periode.interface';
import { Clip } from '../interface/clip.interface';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

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
  VideoByCategories: PeriodeData[] = [];
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

  checkCategorieLoadded() {
    if (typeof window !== 'undefined' && window.document) {
      if (window.innerWidth < 715) {
        this.categoriesLoaded = 3;
      }
    }
  }
  randomSort() {
    return Math.random() - 0.5;
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
    this.getLastVideo();

    this.getVideosByCategory();
  }

  ClipIsLiked() {
    // récupère id de l'utilisateur
    if (this.userId) {
      //récupère les clips like par l'utilisateur
      this.apiVald.getClipsLiked(this.userId).subscribe();
    }
  }

  getLastVideo() {
    const storage = localStorage.getItem('lastVideo');
    if (storage) {
      this.lastVideo = JSON.parse(storage);
      this.updateSafeUrl()
    } else {
      this.apiVald.getLastVideo().subscribe((data) => {
        this.lastVideo = data;
        const safeUrl: SafeResourceUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.youtube.com/embed/${this.lastVideo.url}?si=bIxfegmGGYSRY5Wm&controls=0&showinfo=0&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&loop=1&playlist=${this.lastVideo.url}&disablekb=1&enablejsapi=1&autoplay=1&mute=${this.isMuted}`
          );
        this.lastVideo.safeUrl = safeUrl;
        localStorage.setItem('lastVideo', JSON.stringify(this.lastVideo));
      });
    }
  }

  getVideosByCategory() {
    const storedData = localStorage.getItem('allContent');

    if (storedData) {
      console.log('Récupération le localStorage...');

      try {
        // Récupérer les vidéos et filtrer uniquement les interview
        const allVideos = JSON.parse(storedData);
        console.log(allVideos);
        const interviewOnly = allVideos.filter((video: any) => !video.artiste); // Exclut les Clip
        console.log(interviewOnly);

        this.VideoByCategories = this.groupVideosByCategory(interviewOnly);
        this.VideoByCategories.sort(this.randomSort);
        this.displayedCategories = this.VideoByCategories.slice(
          0,
          this.categoriesLoaded
        );
        return;
      } catch (error) {
        console.warn(error);
        localStorage.removeItem('allContent');
      }
    } else {
      console.log("Récupération des vidéos depuis l'API...");
      this.apiVald.getAllContent().subscribe({
        next: (videos: any[]) => {
          this.getTypeContent(videos);
          localStorage.setItem('allContent', JSON.stringify(videos));
          const filtredVideos = videos.filter((video) => !video.artiste);
          this.VideoByCategories = this.groupVideosByCategory(filtredVideos);
          this.displayedCategories = this.VideoByCategories.slice(
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
    if (typeof window !== 'undefined' && window.document) {
      if (window.innerWidth < 715) {
        if (
          window.innerHeight + window.scrollY + 350 >=
            document.body.offsetHeight &&
          this.displayedCategories.length < this.VideoByCategories.length
        ) {
          this.loadMoreCategories();
        }
      } else if (
        window.innerHeight + window.scrollY + 120 >=
          document.body.offsetHeight &&
        this.displayedCategories.length < this.VideoByCategories.length
      ) {
        this.loadMoreCategories();
      }
    }
  }

  loadMoreCategories() {
    const newInterviews: any[] = this.VideoByCategories.slice(
      this.displayedCategories.length,
      this.displayedCategories.length + this.categoriesLoaded
    );

    newInterviews.forEach((newInterview) => {
      const alreadyExists = this.displayedCategories.some(
        (displayCategorie) => displayCategorie.title === newInterview.title
      );

      if (!alreadyExists) {
        this.displayedCategories.push(newInterview);
      }
    });
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
