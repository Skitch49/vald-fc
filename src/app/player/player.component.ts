import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute,  } from '@angular/router';
import { ApiValdService } from '../services/api-vald.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit, AfterViewInit {
  idClip: any;
  clip: any;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private apiVald: ApiValdService,
    private viewportScroller: ViewportScroller
  ) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scrollToTop();
    }, 500);
  }

  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      this.idClip = params['id'];
    });

    this.apiVald.getClipsByUrl(this.idClip).subscribe((clip) => {
      this.clip = clip;
    });

    if (this.idClip) {
      const safeUrl: SafeResourceUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${this.idClip}?si=bIxfegmGGYSRY5Wm&autoplay=1&controls=2&showinfo=1&playsinline=0&modestbranding=1&rel=0&iv_load_policy=3&fs=1&loop=1&disablekb=0&playlist=${this.idClip}`
        );
      this.idClip = safeUrl;
    }
  }

  private scrollToTop(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}
