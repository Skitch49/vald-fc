import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiValdService } from '../services/api-vald.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { Clip } from '../interface/clip.interface';
import { GoogleApiService } from '../services/google-api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit, AfterViewInit {
  query: string = '';
  contents: any;
  contentsDisplay: any = [];
  clipWithAllInfo: any;
  userId: string | null = null;
  isMobileScreen = false;
  typeVideo: string = 'Interview';
  sortDirection = false;
  @ViewChild('selectSort') selectSort!: any;
  @ViewChild('loader') loader!: any;
  constructor(
    private route: ActivatedRoute,
    private apiValdService: ApiValdService,
    private dialog: MatDialog,
    private readonly google: GoogleApiService
  ) {}


  changesortDirection() {
    this.sortDirection = !this.sortDirection;
    this.contentsDisplay.reverse();
  }

  onSortChange() {
    this.sortDirection = false;
    const selectedValue = this.selectSort.nativeElement.value;
    switch (selectedValue) {
      case 'name':
        this.contentsDisplay.sort((a: any, b: any) => {
          return a.name.localeCompare(b.name);
        });

        break;
      case 'date':
        this.contentsDisplay.sort((a: any, b: any) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        break;
      case 'cat':
        this.contentsDisplay.sort((a: any, b: any) => {
          return a.categorie.localeCompare(b.categorie);
        });
        break;
      case 'pop':
        this.contentsDisplay.sort((a: any, b: any) => {
          const aLikersCount = Array.isArray(a.likers) ? a.likers.length : 0;
          const bLikersCount = Array.isArray(b.likers) ? b.likers.length : 0;
          return bLikersCount - aLikersCount;
        });
        break;
    }
  }

  ngOnInit(): void {
    this.checkScreenSize();
    this.google.getUserIdObservable().subscribe((userId) => {
      this.userId = userId;
    });
    this.getAllContent();
    this.route.queryParams.subscribe((params) => {
      this.query = params['q'].toLowerCase().trim() || '';
      if (this.query) {
        this.applyFilter();
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.contents) {
      if (this.loader) {
        this.loader.nativeElement.remove();
      }
    }
  }

  applyFilter() {
    if (!this.contents) return; // Vérifie si les contenus sont chargés

    // Tableau des mois en français
    const monthsFr = [
      'janvier',
      'février',
      'mars',
      'avril',
      'mai',
      'juin',
      'juillet',
      'août',
      'septembre',
      'octobre',
      'novembre',
      'décembre',
    ];

    // Transformer la requête en tableau de mots-clés sans accents
    const queryWords = this.normalizeText(this.query).split(' ');

    this.contentsDisplay = this.contents.filter((content: any) => {
      // Extraire l'année, le mois et le jour de la date
      const dateObj = new Date(content.date);
      const year = dateObj.getFullYear().toString(); // "2012"
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // "03"
      const monthFr = monthsFr[dateObj.getMonth()]; // "mars"
      const day = dateObj.getDate().toString().padStart(2, '0'); // "25"

      // Récupérer les noms des artistes dans les tableaux
      const producedNames = (content.produced || [])
        .map((p: any) => p.nameArtiste)
        .join(' ');
      const productionNames = (content.production || [])
        .map((p: any) => p.nameArtiste)
        .join(' ');
      const featuringNames = (content.featuring || [])
        .map((f: any) => f.nameArtiste)
        .join(' ');

      // Normaliser et regrouper tous les champs dans une seule chaîne
      const contentText = this.normalizeText(
        `${content.categorie} ${content.description} ${content.name} ${content.author?.nameArtiste} 
        ${content.artiste?.nameArtiste} ${featuringNames} ${content.mastering?.nameArtiste} 
        ${content.mix?.nameArtiste} ${producedNames} ${productionNames} ${content.real?.nameArtiste} ${content.type}
        ${year} ${month} ${monthFr} ${day}`
      );

      // Vérifier que chaque mot-clé de la recherche est présent dans le texte du contenu
      return queryWords.every((word) => contentText.includes(word));
    });

  }

  // Fonction pour normaliser le texte (mettre en minuscule et enlever les accents)
  normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD') // Décompose les caractères accentués
      .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
      .trim();
  }

  getTypeContent(videos: any[]) {
    videos.forEach((clip) => {
      clip.type = clip.author ? 'interview' : 'clip';
    });
  }

  getAllContent(): void {
    const storedData = localStorage.getItem('allContent');
  
    if (storedData) {
      this.contents = JSON.parse(storedData);
      this.applyFilter();
      if (this.loader && this.loader.nativeElement) {
        this.loader.nativeElement.remove();
      }
    } else {
      this.apiValdService.getAllContent().subscribe((data) => {
        this.getTypeContent(data);
        this.contents = data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        localStorage.setItem('allContent', JSON.stringify(this.contents));
        this.applyFilter();
        if (this.loader && this.loader.nativeElement) {
          this.loader.nativeElement.remove();
        }
      });
    }
  }
  

  getClip(clip: any): void {
    if (clip && clip.artiste) {
      this.typeVideo = 'Clip';
      this.clipWithAllInfo = this.contents.find((c: any) => c._id === clip._id);
      this.openDialog(this.clipWithAllInfo, this.userId, this.typeVideo);
    }
    if (clip && clip.author) {
      this.typeVideo = 'Interview';
      this.clipWithAllInfo = this.contents.find((c: any) => c._id === clip._id);
      this.openDialog(this.clipWithAllInfo, this.userId, this.typeVideo);
    }
  }
  openDialog(clip: any, userId: string | null, typeVideo: string) {
    const dialogConfig = {
      width: this.isMobileScreen ? '99vw' : '48vw',
      height: 'auto',
      maxHeight: '95vh',
      data: { clip: clip, userId: userId, typeVideo },
    };
    this.dialog.open(DialogComponent, dialogConfig);
  }

  likeClip(clip: Clip) {
    if (!this.userId) return;

    const isLiked = this.isLikedByUser(clip);
    this.updateClipLikeState(clip, !isLiked);

    this.apiValdService.toggleLike(clip._id, this.userId, !isLiked).subscribe({
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
    if (this.userId && clip.likers) {
      return clip.likers.includes(this.userId);
    } else {
      return false;
    }
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
}
