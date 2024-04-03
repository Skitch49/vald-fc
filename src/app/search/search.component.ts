import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiValdService } from '../services/api-vald.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { Clip } from '../interface/clip.interface';
import { GoogleApiService } from '../services/google-api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  query: string = '';
  clips: any;
  clipWithAllInfo: any;
  userId: string | null = null;
  isMobileScreen = false;
  typeVideo: string = 'Interview';
  constructor(
    private route: ActivatedRoute,
    private apiValdService: ApiValdService,
    private dialog: MatDialog,
    private readonly google: GoogleApiService
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.google.getUserIdObservable().subscribe((userId) => {
      this.userId = userId;
    });

    this.route.queryParams.subscribe((params) => {
      this.query = params['q'] || '';
      if (this.query) {
        this.performSearch(this.query);
      }
    });
  }

  performSearch(query: string): void {
    this.apiValdService.getClipsArtistesFeaturing(query).subscribe((data) => {
      this.clips = data; // assigner les données reçues à la propriété clips
    });
  }

  getClip(clip: any): void {
    console.log(JSON.stringify(clip));
    if (clip && clip.artiste) {
      this.typeVideo = 'Clip';
      console.log('type :' + this.typeVideo);

      this.apiValdService.getClipsByUrl(clip.url).subscribe((data) => {
        this.clipWithAllInfo = data;

        this.openDialog(this.clipWithAllInfo, this.userId, this.typeVideo); // Déplacez cette ligne ici
      });
    }
    if (clip && clip.author) {
      this.typeVideo = 'Interview';
      console.log('type :' + this.typeVideo);
      this.apiValdService.getVideoByUrl(clip.url).subscribe((data) => {
        this.clipWithAllInfo = data;

        this.openDialog(this.clipWithAllInfo, this.userId, this.typeVideo); // Déplacez cette ligne ici
      });
    }
  }
  openDialog(clip: any, userId: string | null, typeVideo: string) {
    const dialogConfig = {
      width: this.isMobileScreen ? '99vw' : '48vw',
      height: 'auto',
      maxHeight: '95vh',
      data: { clip: clip, userId: userId, typeVideo },
    };
    this.dialog.open(DialogComponent, dialogConfig);
  }

  likeClip(clip: Clip) {
    if (!this.userId) return;

    const isLiked = this.isLikedByUser(clip);
    this.updateClipLikeState(clip, !isLiked);

    this.apiValdService.toggleLike(clip._id, this.userId, !isLiked).subscribe({
      next: () => {
        // Gestion de la réponse réussie
      },
      error: () => {
        // Revenir à l'état précédent en cas d'erreur
        this.updateClipLikeState(clip, isLiked);
        // Gérer l'erreur (par exemple, afficher un message d'erreur à l'utilisateur)
      },
    });
  }
  private updateClipLikeState(clip: Clip, isLiked: boolean) {
    if (isLiked && this.userId) {
      clip.likers.push(this.userId);
    } else {
      if (this.userId) {
        const index = clip.likers.indexOf(this.userId);
        if (index > -1) {
          clip.likers.splice(index, 1);
        }
      }
    }
  }
  isLikedByUser(clip: Clip): boolean {
    if (this.userId && clip.likers) {
      return clip.likers.includes(this.userId);
    } else {
      return false;
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
    }
  }
}
