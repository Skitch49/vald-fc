import {
  Component,
  ElementRef,
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
  @Input() clips: Clip[] = [];
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  constructor(private dialog: MatDialog) {}

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
      320: {
        slidesPerView: 3,
        slidesPerGroup: 3,
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 3,
        slidesPerGroup: 3,
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 4,
        slidesPerGroup: 4,
      },
      940: {
        slidesPerView: 6.4,
        slidesPerGroup: 6,
      },
    },
  };
  openDialog(clip: any) {
    this.dialog.open(DialogComponent, {
      width: '48vw',
      height: 'auto',
      data: clip,
    });
  }
}
