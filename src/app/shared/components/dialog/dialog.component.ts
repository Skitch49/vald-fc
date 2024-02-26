import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Artiste } from '../../../interface/artiste.interface';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent implements OnInit {
  hoverStates: { [key: string]: boolean } = {};

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.initializeHoverStates();
    console.log('in dialog '+JSON.stringify(this.data));
    
  }

  initializeHoverStates() {
    const categories = ['produced', 'featuring', 'mix', 'mastering', 'real', 'artiste', 'production'];
    categories.forEach(category => {
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
  
  
}
