import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Clip } from '../interface/clip.interface';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-swiper',
  templateUrl: './swiper.component.html',
  styleUrl: './swiper.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SwiperComponent {
  isMobileScreen = false;
  @Input() clips: Clip[] = [];
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  constructor(private dialog: MatDialog) {
    this.checkScreenSize();
    
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
    },

    loop: true,
    loopAddBlankSlides: false,

    slidesPerGroup: 6,
    // Responsive breakpoints
    breakpoints: {
      // when window width is >= 320px
      0: {
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
  openDialog(clip: any) {

    if (this.isMobileScreen) {
      this.dialog.open(DialogComponent, {
        width: '100vw',
        height: 'auto',
        data: clip,
      });
    } else {
      this.dialog.open(DialogComponent, {
        width: '48vw',
        height: 'auto',
        data: clip,
      });
    }

    
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
      console.log(this.isMobileScreen);
    }
   }
    
}
