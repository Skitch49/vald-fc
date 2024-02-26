import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiValdService } from '../services/api-vald.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { Clip } from '../interface/clip.interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  query: string = '';
  clips: any;
  clipWithAllInfo: any;
  constructor(
    private route: ActivatedRoute,
    private apiValdService: ApiValdService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.query = params['q'] || '';
      if (this.query) {
        this.performSearch(this.query);
      }
    });
  }

  performSearch(query: string): void {
    this.apiValdService.getClipsArtistesFeaturing(query).subscribe((data) => {
      this.clips = data; // assigner les données reçues à la propriété clips
    });
  }

  getClip(clip: any): void {
    this.apiValdService.getClipsByUrl(clip.url).subscribe((data) => {
      this.clipWithAllInfo = data;
      this.openDialog(this.clipWithAllInfo); // Déplacez cette ligne ici
    });
    // Ne pas ouvrir le dialogue ici car clipWithAllInfo n'est pas encore défini
  }
  openDialog(clipWithAllInfo: any) {
    
    this.dialog.open(DialogComponent, {
      width: '48vw',
      height: 'auto',
      data: clipWithAllInfo,
      
    });
  }
}
