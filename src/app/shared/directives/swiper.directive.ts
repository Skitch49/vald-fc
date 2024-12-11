import { AfterViewInit, Directive, ElementRef, Input, Inject, PLATFORM_ID } from '@angular/core';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';
import { isPlatformBrowser } from '@angular/common';
@Directive({
  selector: '[appSwiper]'
})
export class SwiperDirective implements AfterViewInit {
  @Input() config?: SwiperOptions;

  constructor(private el: ElementRef<SwiperContainer>, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Vérifie si l'application est exécutée dans un navigateur
      Object.assign(this.el.nativeElement, this.config);

      this.el.nativeElement.initialize(); // N'initialise que dans le navigateur
    }
  }
}
