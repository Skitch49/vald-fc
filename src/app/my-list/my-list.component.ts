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
  clips: any |null = null;
  isMobileScreen = false;

  constructor(
    private googleApiService: GoogleApiService,
    private apiVald: ApiValdService,
    private dialog: MatDialog
  ) {
    this.checkScreenSize();

  }

  ngOnInit() {
    this.checkScreenSize()
    this.googleApiService.getUserIdObservable().subscribe((userId) => {
      this.userId = userId;
    });
    this.ClipsLiked();
  }

  public ClipsLiked() {
    if (this.userId) {
      this.apiVald.getClipsLiked(this.userId).subscribe((data) => {
        this.clips = data;
      });
    }
  }

  openDialog(clip: any, userId: string | null) {
    const dialogConfig = {
      width: this.isMobileScreen ? '99vw' : '48vw',
      height: 'auto',
      maxHeight: '95vh',
      data: { clip: clip, userId: userId },
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
    if (typeof window !== "undefined") {
      if (window.innerWidth <= 768) {
        this.isMobileScreen = true;
      } else {
        this.isMobileScreen = false;
      }
    }
   }

   likeClip(clip: Clip) {
    if (!this.userId) return;

    const isLiked = this.isLikedByUser(clip);
    this.updateClipLikeState(clip, !isLiked);
    this.apiVald.toggleLike(clip._id, this.userId, !isLiked).subscribe({
      next: () => {
        // Gestion de la réponse réussie
        this.ClipsLiked()
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
    if (this.userId) {
      return clip.likers.includes(this.userId);
    } else {
      return false;
    }
  }
    


}

