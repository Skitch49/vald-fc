import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Artiste } from '../../../interface/artiste.interface';
import { ApiValdService } from '../../../services/api-vald.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent implements OnInit {
  hoverStates: { [key: string]: boolean } = {};
  clip = this.data.clip;
  backgroundUrl: String = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiVald: ApiValdService
  ) {}

  ngOnInit(): void {
    this.initializeHoverStates();
    this.setImageUrl();
  }

  initializeHoverStates() {
    const categories = [
      'produced',
      'featuring',
      'mix',
      'mastering',
      'real',
      'artiste',
      'production',
    ];
    categories.forEach((category) => {
      const artists = this.data[category];
      if (Array.isArray(artists)) {
        artists.forEach((artist: Artiste) => {
          this.hoverStates[`${category}-${artist.nameArtiste}`] = false;
        });
      } else if (artists) {
        this.hoverStates[`${category}-${artists.nameArtiste}`] = false;
      }
    });
  }

  setHoverState(category: string, artistName: string, state: boolean) {
    this.hoverStates[`${category}-${artistName}`] = state;
  }
  @Output() likeUpdated = new EventEmitter<void>();

  likeClip(clip: any) {
    if (!this.data.userId) return;

    const isLiked = this.isLikedByUser(clip);
    this.updateClipLikeState(clip, !isLiked);
    if (clip.artiste) {
      this.apiVald.toggleLike(clip._id, this.data.userId, !isLiked).subscribe({
        next: () => {
          this.likeUpdated.emit();

          // Gestion de la réponse réussie
        },
        error: () => {
          // Revenir à l'état précédent en cas d'erreur
          this.updateClipLikeState(clip, isLiked);
          // Gérer l'erreur (par exemple, afficher un message d'erreur à l'utilisateur)
        },
      });
    }
    if (clip.author) {
      this.apiVald
        .toggleLikeVideo(clip._id, this.data.userId, !isLiked)
        .subscribe({
          next: () => {
            this.likeUpdated.emit();
            // Gestion de la réponse réussie
          },
          error: () => {
            // Revenir à l'état précédent en cas d'erreur
            this.updateClipLikeState(clip, isLiked);
          },
        });
    }
  }
  private updateClipLikeState(clip: any, isLiked: boolean) {
    if (isLiked && this.data.userId) {
      clip.likers.push(this.data.userId);
    } else {
      if (this.data.userId) {
        const index = clip.likers.indexOf(this.data.userId);
        if (index > -1) {
          clip.likers.splice(index, 1);
        }
      }
    }
  }
  isLikedByUser(clip: any): boolean {
    if (this.data.userId) {
      return clip.likers.includes(this.data.userId);
    } else {
      return false;
    }
  }

  // Méthode pour vérifier si l'URL d'une image existe
  checkImageExists(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (img.width <= 120 && img.height <= 90) {
          resolve(false); // Considère cette image comme invalide
        } else {
          resolve(true);
        }
      };
      img.onerror = () => resolve(false);
      console.log(resolve);
      img.src = url;
    });
  }

  // Méthode pour définir l'URL de l'image
  async setImageUrl() {
    const urls = [
      `https://i.ytimg.com/vi/${this.clip.url}/maxresdefault.jpg`,
      `http://img.youtube.com/vi/${this.clip.url}/hqdefault.jpg`,
      `http://img.youtube.com/vi/${this.clip.url}/sddefault.jpg`,
    ];

    for (const url of urls) {
      const exists = await this.checkImageExists(url);
      if (exists) {
        this.backgroundUrl = url;
        break;
      }
    }
  }
}
