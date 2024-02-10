import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiValdService } from '../services/api-vald.service';
import { Clip } from '../interface/clip.interface';
import { Periode } from '../interface/periode.interface';
import { PeriodeData } from '../interface/periodeData.interface';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../shared/components/dialog/dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent {
  clips: any;
  lastClip: any;
  dateRange: Clip[] = [];
  periods: Periode[] = [
    { title: `L'ère V`, startDate: '2021-01-16', endDate: '2024-12-31' },
    { title: 'Post CMEC', startDate: '2019-09-13', endDate: '2021-01-15' },
    { title: 'Post Xeu', startDate: '2018-01-05', endDate: '2019-09-12' },
    { title: 'Post Agartha', startDate: '2016-10-21', endDate: '2018-01-05' },
    { title: 'Post NQNT 2', startDate: '2015-06-03', endDate: '2016-10-21' },
    { title: 'NQNT', startDate: '2011-06-03', endDate: '2015-06-03' },
    // Ajoutez d'autres périodes selon vos besoins
  ];
  periodData: PeriodeData[] = []; // Modifiez le type pour être un tableau

  isMuted: boolean = true;

  constructor(
    private apiVald: ApiValdService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {}

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.updateSafeUrl();

    localStorage.setItem('mute', this.isMuted.toString());
  }

  ngOnInit() {

    const muteValue = localStorage.getItem('mute');
    if (muteValue) {
      this.isMuted = muteValue === 'true'; // Convertissez la chaîne en booléen
      this.updateSafeUrl();
    }

    // GET LAST CLIP
    this.apiVald.getLastClip().subscribe((data) => {
      this.lastClip = data;
      const safeUrl: SafeResourceUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${this.lastClip.url}?si=bIxfegmGGYSRY5Wm&autoplay=1&controls=0&showinfo=0&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&loop=1&playlist=${this.lastClip.url}&disablekb=1&enablejsapi=1&mute=${this.isMuted}`
        );
      this.lastClip.safeUrl = safeUrl;
    });

    // GET ALL CLIPS
    this.apiVald.getClips().subscribe((data) => {
      this.clips = data;
    });

    // Parcourez les périodes et appelez getClipsByDateRange pour chaque période
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
          `https://www.youtube.com/embed/${this.lastClip.url}?si=bIxfegmGGYSRY5Wm&autoplay=1&controls=0&showinfo=0&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&loop=1&playlist=${this.lastClip.url}&disablekb=1&enablejsapi=1&mute=${this.isMuted}`
        );
      this.lastClip.safeUrl = safeUrl;
    }
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '48vw',
      height: 'auto',
      data: this.lastClip
    });
  }
}
