import { Component, HostListener, OnInit } from '@angular/core';
import { GoogleApiService } from '../services/google-api.service';
import { ApiValdService } from '../services/api-vald.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { Clip } from '../interface/clip.interface';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrl: './my-list.component.scss',
})
export class MyListComponent implements OnInit {
  userId: string | null = null;
  videos: any | null = null;
  isMobileScreen = false;

  constructor(
    private googleApiService: GoogleApiService,
    private apiVald: ApiValdService,
    private dialog: MatDialog
  ) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.checkScreenSize();
    this.googleApiService.getUserIdObservable().subscribe((userId) => {
      this.userId = userId;
    });
    this.ClipsLiked();
  }

  public ClipsLiked() {
    if (this.userId) {
      this.apiVald.getAllVideoLiked(this.userId).subscribe((data) => {
        this.videos = data;
      });
    }
  }

  openDialog(video: any, userId: string | null, typeVideo: string) {
    const dialogConfig = {
      width: this.isMobileScreen ? '99vw' : '48vw',
      height: 'auto',
      maxHeight: '95vh',
      data: { clip: video, userId: userId, typeVideo: typeVideo },
    };

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      this.ClipsLiked();
    });

    // Écouter l'événement likeUpdated
    dialogRef.componentInstance.likeUpdated.subscribe(() => {
      this.ClipsLiked();
    });
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

  likeClip(video: any) {
    if (!this.userId) return;

    const isLiked = this.isLikedByUser(video);
    this.updateClipLikeState(video, !isLiked);

    if (video.artiste) {
      this.apiVald.toggleLike(video._id, this.userId, !isLiked).subscribe({
        next: () => {
          // Gestion de la réponse réussie
          this.ClipsLiked();
        },
        error: () => {
          // Revenir à l'état précédent en cas d'erreur
          this.updateClipLikeState(video, isLiked);
        },
      });
    }

    if (video.author) {
      this.apiVald.toggleLikeVideo(video._id, this.userId, !isLiked).subscribe({
        next: () => {
          // Gestion de la réponse réussie
          this.ClipsLiked();
        },
        error: () => {
          // Revenir à l'état précédent en cas d'erreur
          this.updateClipLikeState(video, isLiked);
        },
      });
    }
  }
  private updateClipLikeState(video: Clip, isLiked: boolean) {
    if (isLiked && this.userId) {
      video.likers.push(this.userId);
    } else {
      if (this.userId) {
        const index = video.likers.indexOf(this.userId);
        if (index > -1) {
          video.likers.splice(index, 1);
        }
      }
    }
  }
  isLikedByUser(video: Clip): boolean {
    if (this.userId) {
      return video.likers.includes(this.userId);
    } else {
      return false;
    }
  }
}
