import { Component, HostListener } from '@angular/core';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PeriodeData } from '../interface/periodeData.interface';
import { ApiValdService } from '../services/api-vald.service';
import { MatDialog } from '@angular/material/dialog';
import { GoogleApiService } from '../services/google-api.service';
import { Periode } from '../interface/periode.interface';
import { Clip } from '../interface/clip.interface';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrl: './clip.component.scss'
})
export class ClipComponent {
  clips!: Clip;
  lastClip: any;
  dateRange: Clip[] = [];
  isMobileScreen: boolean = false;
  likedClipIds: Set<string> = new Set();
  userId: string | null = null;
  periods: Periode[] = [
    { title: `L'ère V`, startDate: '2021-01-16', endDate: '2024-12-31' },
    { title: 'Post CMEC', startDate: '2019-09-13', endDate: '2021-01-15' },
    { title: 'Post Xeu', startDate: '2018-01-05', endDate: '2019-09-12' },
    { title: 'Post Agartha', startDate: '2016-10-21', endDate: '2018-01-05' },
    { title: 'Post NQNT 2', startDate: '2015-06-03', endDate: '2016-10-20' },
    { title: 'NQNT', startDate: '2011-06-03', endDate: '2015-06-02' },
    // Ajoutez d'autres périodes selon vos besoins
  ];
  periodData: PeriodeData[] = []; // Modifiez le type pour être un tableau

  isMuted: boolean = true;

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

  ngOnInit() {
    this.userId = this.google.getUserId();

    if (typeof window !== 'undefined' && window.document) {
      const muteValue = localStorage.getItem('mute');
      if (muteValue) {
        this.isMuted = muteValue === 'true'; // Convertissez la chaîne en booléen
        this.updateSafeUrl();
      }
    }

    this.getLastClip();

    this.getClipsByDateRange();
  }

  ClipIsLiked() {
    // récupère id de l'utilisateur
    if (this.userId) {
      //récupère les clips like par l'utilisateur
      this.apiVald.getClipsLiked(this.userId).subscribe();
    }
  }

  getLastClip() {
    this.apiVald.getLastClip().subscribe((data) => {
      this.lastClip = data;
      const safeUrl: SafeResourceUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${this.lastClip.url}?si=bIxfegmGGYSRY5Wm&controls=0&showinfo=0&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&loop=1&playlist=${this.lastClip.url}&disablekb=1&enablejsapi=1&autoplay=1&mute=${this.isMuted}`
        );
      this.lastClip.safeUrl = safeUrl;
    });
  }

  getClipsByDateRange() {
    this.periods.forEach((period) => {
      this.apiVald
        .getClipsByDateRange(period.startDate, period.endDate)
        .subscribe((data) => {
          // Utilisez les données comme nécessaire, par exemple, stockez-les dans un objet avec le titre de la période
          const periodDatum: PeriodeData = { title: period.title, clips: data };
          // Ajoutez periodDatum au tableau periodData
          this.periodData.push(periodDatum);
          // Faites ce dont vous avez besoin avec periodData
        });
    });
  }

  updateSafeUrl() {
    if (this.lastClip) {
      const safeUrl: SafeResourceUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${this.lastClip.url}?si=bIxfegmGGYSRY5Wm&controls=0&showinfo=0&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&loop=1&playlist=${this.lastClip.url}&disablekb=1&enablejsapi=1&autoplay=1&mute=${this.isMuted}`
        );
      this.lastClip.safeUrl = safeUrl;
    }
  }



  openDialog(clip: any, userId: string | null) {
    const dialogConfig = {
      width: this.isMobileScreen ? '99vw' : '48vw',
      height: 'auto',
      maxHeight: '95vh',
      data: { clip: clip, userId: userId },
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
