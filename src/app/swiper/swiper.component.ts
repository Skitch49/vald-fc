import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Clip } from '../interface/clip.interface';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';
import { MatDialog } from '@angular/material/dialog';
import { GoogleApiService } from '../services/google-api.service';
import { ApiValdService } from '../services/api-vald.service';
import { DialogComponent } from '../shared/components/dialog/dialog.component';

@Component({
  selector: 'app-swiper',
  templateUrl: './swiper.component.html',
  styleUrl: './swiper.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SwiperComponent implements OnInit {
  isMobileScreen = false;
  userId: string | null = null;
  @Input() clips: Clip[] = [];
  @Input() typeVideo: string = "Clip";
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  constructor(
    private dialog: MatDialog,
    private googleApiService: GoogleApiService,
    private apiVald: ApiValdService
  ) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.googleApiService.getUserIdObservable().subscribe((userId) => {
      this.userId = userId;
    });
  }
  
  // Swiper
  swiperConfig: SwiperOptions = {
    slidesPerView: 6.4,

    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next-test',
      prevEl: '.swiper-button-prev-test',
      disabledClass: 'swiper-button-hidden',
    },

    loop: true,
    loopAddBlankSlides: false,
    slidesPerGroup: 6,
    // Responsive breakpoints
    breakpoints: {
      // when window width is >= 320px
      0: {
        slidesPerView: 1.2,
        slidesPerGroup: 1,
      },
      361: {
        slidesPerView: 2.3,
        slidesPerGroup: 2,
      },
      471: {
        slidesPerView: 2.5,
        slidesPerGroup: 2,
      },
      // when window width is >= 480px
      641: {
        slidesPerView: 3.5,
        slidesPerGroup: 3,
      },
      // when window width is >= 640px
      841: {
        slidesPerView: 4.5,
        slidesPerGroup: 4,
      },
      1301: {
        slidesPerView: 5.5,
        slidesPerGroup: 5,
      },
      1481: {
        slidesPerView: 6.4,
        slidesPerGroup: 6,
      },
    },
  };

  swiperConfigForFewSlides: SwiperOptions = {
    slidesPerView: 6.4,
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
    navigation: {
      disabledClass: 'swiper-button-hidden',
    },

    loopAddBlankSlides: false,
    slidesOffsetAfter: 125,
    slidesPerGroup: 6,
    // Responsive breakpoints
    breakpoints: {
      // when window width is >= 320px
      0: {
        slidesPerView: 1.2,
        slidesPerGroup: 1,
        loop: true,
      },
      361: {
        slidesPerView: 2.3,
        slidesPerGroup: 2,
        loop: true,
      },
      471: {
        slidesPerView: 2.5,
        slidesPerGroup: 2,
        loop: true,
      },
      // when window width is >= 480px
      641: {
        slidesPerView: 3.5,
        slidesPerGroup: 3,
        loop: true,
      },
      // when window width is >= 640px
      841: {
        slidesPerView: 4.5,
        slidesPerGroup: 4,
        loop: true,
      },
      1301: {
        slidesPerView: 5.5,
        slidesPerGroup: 5,
      },
      1481: {
        slidesPerView: 6.4,
        slidesPerGroup: 6,
      },
    },
  };
  openDialog(clip: any, userId: string | null, typeVideo:string) {
    const dialogConfig = {
      width: this.isMobileScreen ? '99vw' : '48vw',
      height: 'auto',
      maxHeight: '95vh',
      data: { clip: clip, userId: userId, typeVideo: typeVideo},
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

  likeClip(clip: any) {
    if (!this.userId) return;

    const isLiked = this.isLikedByUser(clip);
    this.updateClipLikeState(clip, !isLiked);
    if(clip.artiste){
      this.apiVald.toggleLike(clip._id, this.userId, !isLiked).subscribe({
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
    if(clip.author){
      this.apiVald.toggleLikeVideo(clip._id, this.userId, !isLiked).subscribe({
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

  getSwiperConfig() {
    if (this.clips.length > 6 && this.clips.length < 12) {
      return this.swiperConfigForFewSlides;
    } else {
      return this.swiperConfig;
    }
  }
}
