import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiValdService } from '../services/api-vald.service';
import { ViewportScroller } from '@angular/common';
import { YouTubePlayer } from '@angular/youtube-player';
import { Artiste } from '../interface/artiste.interface';
import { GoogleApiService } from '../services/google-api.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent
  implements OnInit, AfterViewInit, AfterContentChecked
{
  @ViewChild('youtubePlayer') youtubePlayer!: YouTubePlayer;
  @ViewChild('loader') loader!: any;
  playerConfig = {
    controls: 2,
    autoplay: 1,
    rel: 0,
    playsinline: 1,
  };
  idClip: any;
  clip: any;
  playlist: any;
  selectedIndexClip: any;
  errorLoadVideo: boolean = false;
  userId: string | null = null;
  hoverStates: { [key: string]: boolean } = {}; //for tooltip

  isRandomSort: boolean = false; // toggle for sort Next Video
  constructor(
    private route: ActivatedRoute,
    private apiVald: ApiValdService,
    private viewportScroller: ViewportScroller,
    private googleApiService: GoogleApiService
  ) {}
  ngAfterContentChecked(): void {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.style.width = '100vw';
      iframe.style.height = '77.25vw'; // Calcul de la hauteur pour maintenir le ratio 16:9
    }
  }

  ngAfterViewInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }
  afterloaded() {
    if (this.loader) {
      this.viewportScroller.scrollToPosition([0, 0]);
      this.loader.nativeElement.classList.add('loading-out');
      setTimeout(() => {
        this.loader.nativeElement.remove();
      }, 200);
    }
  }

  ngOnInit(): void {
    if (
      !document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      )
    ) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }

    this.route.params.subscribe((params: any) => {
      this.idClip = params['id'];
      this.getDataClip(this.idClip);
      this.getPlaylist();
    });
    this.googleApiService.getUserIdObservable().subscribe((userId) => {
      this.userId = userId;
    });
    const storageRandomToggle = localStorage.getItem('isRandomSort');
    if (storageRandomToggle) {
      this.isRandomSort = JSON.parse(storageRandomToggle);
      this.changeSortPlaylist(this.isRandomSort);
    }

    // Force a supprimer le loader si il y a une erreur
    setTimeout(() => {
      this.afterloaded();
    }, 5000);
  }

  isLikedByUser() {
    if (this.clip.likers && this.clip.likers.length > 0) {
      const liked = this.clip.likers.find(
        (userId: string) => userId === this.userId
      );
      if (liked) {
        return true;
      }
    }
    return false;
  }
  likeClip() {
    if (!this.userId) return;

    const isLiked = this.isLikedByUser();

    this.apiVald.toggleLike(this.clip._id, this.userId, !isLiked).subscribe({
      next: (data) => {
        // Gestion de la réponse réussie
        // this.updateClipLikeState(this.clip, isLiked);
        this.clip.likers = data.likers;
      },
    });
  }

  changeSortPlaylist(check: boolean) {
    this.isRandomSort = check;
    localStorage.setItem('isRandomSort', JSON.stringify(this.isRandomSort));
    console.log('---------------');
    if (this.isRandomSort) {
      // mélanger le tableau this.playlist
      this.playlist.sort((a: any, b: any) => {
        return 0.5 - Math.random();
      });

      this.selectedIndexClip = this.playlist.findIndex((clip: any) => {
        return (
          clip.url.trim().toLowerCase() == this.clip.url.trim().toLowerCase()
        );
      });
      console.log(this.playlist[this.selectedIndexClip + 1].name);
    } else {
      // remettre le tableau this.playlist a l'état initial
      this.playlist = this.playlist
        .filter(
          (clip: any) =>
            clip.url !== 'uFnlCzgThS8' && clip.url !== 'vfUFTHAQKeg'
        )
        .sort((a: any, b: any) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
      this.selectedIndexClip = this.playlist.findIndex((clip: any) => {
        return (
          clip.url.trim().toLowerCase() == this.clip.url.trim().toLowerCase()
        );
      });
      console.log(this.playlist[this.selectedIndexClip + 1].name);
    }
  }

  onStageChange(e: any) {
    console.log(e.target);
    switch (e.data) {
      case -1: // Chargement
        console.log('code -1');
        e.target.playVideo();
        this.afterloaded();

        break;
      case 0: // Fin de la vidéo
        console.log('End of Song');
        if (this.playlist && this.playlist.length > 0) {
          console.log('Lecture vidéo unique, passage manuel');
          this.selectedIndexClip =
            (this.selectedIndexClip + 1) % this.playlist.length;

          this.clip = this.playlist[this.selectedIndexClip];
          e.target.loadVideoById(this.playlist[this.selectedIndexClip].url);
        }
        break;
      case 1: // Lecture en cours
        console.log('Code 1');
        this.afterloaded();

        break;
      case 2: // Pause
        console.log('Pause');
        break;
      case 3:
        console.log('Code 3');
        break;
      case 5: // Vidéo arrêtée
        this.afterloaded();

        console.log('code 5, start next video: ', e.target.videoTitle);
        e.target.playVideo();

        break;
      default: {
        console.error('OnStageChange for youtube: unkown data: ', e.data);
        break;
      }
    }
  }
  onReady(e: any) {
    e.target.setVolume(100);
    e.target.playVideo();
    this.afterloaded();
  }

  nextVideo(e: any) {
    console.error('erreur de lecture de la video ID: ');
    this.errorLoadVideo = true;
    if (this.loader) {
      this.loader.nativeElement.remove();
    }
    const nextIndex = (this.selectedIndexClip + 1) % this.playlist.length;

    setTimeout(() => {
      this.selectedIndexClip = nextIndex;
      e.target.loadVideoById(this.playlist[this.selectedIndexClip].url);
      this.clip = this.playlist[this.selectedIndexClip];
      this.errorLoadVideo = false;
    }, 5000);
  }

  getDataClip(idClip: string) {
    try{
    const storage = localStorage.getItem('clipsPlaylist');
    if (storage) {
      console.log('IN LOCAL STORAGE');

      this.clip = JSON.parse(storage).find(
        (clip: { url: string }) => clip.url === this.idClip
      );
      // Si clip existe mais n'est pas répertorier dans la playlist car restreint par youtube
      if (!this.clip) {
        this.apiVald.getClipsByUrl(idClip).subscribe({
          next: (clip) => {
            this.clip = clip;
          },
          error: (error) => {
            console.error('Erreur lors du chargement de la vidéo', error);
          },
        });
      }
    } else {
      this.apiVald.getClipsByUrl(idClip).subscribe({
        next: (clip) => {
          this.clip = clip;
        },
        error: (error) => {
          console.error('Erreur lors du chargement de la vidéo', error);
        },
      });
    }
  } catch (error) {
    console.error('Erreur dans getDataClip: ', error);
  }
  }
  getPlaylist(): void {
    try {
      const storage = localStorage.getItem('clipsPlaylist');
      if (storage) {
        console.log('IN LOCAL STORAGE');
        this.playlist = JSON.parse(storage);
        this.selectedIndexClip = this.playlist.findIndex((clip: any) => {
          return (
            clip.url.trim().toLowerCase() == this.idClip.trim().toLowerCase()
          );
        });
      } else {
        console.log('NOT IN LOCAL STORAGE');

        this.apiVald.getClips().subscribe((data) => {
          this.playlist = data
            .filter(
              (clip: any) =>
                clip.url !== 'uFnlCzgThS8' && clip.url !== 'vfUFTHAQKeg'
            )
            .sort((a: any, b: any) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return dateB.getTime() - dateA.getTime();
            });
          this.selectedIndexClip = this.playlist.findIndex((clip: any) => {
            return (
              clip.url.trim().toLowerCase() == this.idClip.trim().toLowerCase()
            );
          });

          localStorage.setItem('clipsPlaylist', JSON.stringify(this.playlist));
        });
      }
    } catch (error) {
      console.error('Erreur dans getPlaylist :', error);
    }
  }

  initializeHoverStates() {
    const categories = [
      'produced',
      'featuring',
      'mix',
      'mastering',
      'real',
      'artiste',
      'production',
    ];
    categories.forEach((category) => {
      const artists = this.clip[category];
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
