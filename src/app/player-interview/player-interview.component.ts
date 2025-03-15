import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiValdService } from '../services/api-vald.service';
import { YouTubePlayer } from '@angular/youtube-player';
import { ViewportScroller } from '@angular/common';
import { GoogleApiService } from '../services/google-api.service';
import { Artiste } from '../interface/artiste.interface';

@Component({
  selector: 'app-player-interview',
  templateUrl: './player-interview.component.html',
  styleUrl: './player-interview.component.scss',
})
export class PlayerInterviewComponent
  implements OnInit, AfterContentChecked, AfterViewInit
{
  @ViewChild('youtubePlayer') youtubePlayer!: YouTubePlayer;
  @ViewChild('loader') loader!: any;
  playerConfig = {
    controls: 2,
    autoplay: 1,
    rel: 0,
    playsinline: 1,
  };
  idVideo: any;
  video: any;
  playlist: any;
  selectedIndexVideo: any;
  errorLoadVideo = false;
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
      iframe.style.height = '77.25vw';
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
      this.idVideo = params['id'];
      this.getDataClip();
      this.getPlaylist();

      this.googleApiService.getUserIdObservable().subscribe((userId) => {
        this.userId = userId;
      });
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
    if (this.video.likers && this.video.likers.length > 0) {
      const liked = this.video.likers.find(
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

    this.apiVald
      .toggleLikeVideo(this.video._id, this.userId, !isLiked)
      .subscribe({
        next: (data) => {
          this.video.likers = data.likers;
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

      this.selectedIndexVideo = this.playlist.findIndex((video: any) => {
        return (
          video.url.trim().toLowerCase() == this.video.url.trim().toLowerCase()
        );
      });
      console.log(this.playlist[this.selectedIndexVideo + 1].name);
    } else {
      // remettre le tableau this.playlist a l'état initial
      this.playlist = this.playlist.sort((a: any, b: any) => {
        // Comparaison par catégorie
        const categorySort = a.categorie.localeCompare(b.categorie);
        if (categorySort !== 0) return categorySort;

        // Comparaison par nom d'auteur
        const authorComparison = a.author.nameArtiste.localeCompare(
          b.author.nameArtiste
        );
        if (authorComparison !== 0) return authorComparison;

        // Comparaison par date (du plus ancien au plus récent)
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      this.selectedIndexVideo = this.playlist.findIndex((video: any) => {
        return (
          video.url.trim().toLowerCase() == this.video.url.trim().toLowerCase()
        );
      });
      console.log(this.playlist[this.selectedIndexVideo + 1].name);
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
          this.selectedIndexVideo =
            (this.selectedIndexVideo + 1) % this.playlist.length;

          this.video = this.playlist[this.selectedIndexVideo];
          e.target.loadVideoById(this.playlist[this.selectedIndexVideo].url);
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

  //If error iframe
  nextVideo(e: any) {
    console.error('erreur de lecture de la video ID: ');
    this.errorLoadVideo = true;

    if (this.loader) {
      this.loader.nativeElement.remove();
    }
    const nextIndex = (this.selectedIndexVideo + 1) % this.playlist.length;

    setTimeout(() => {
      this.selectedIndexVideo = nextIndex;
      e.target.loadVideoById(this.playlist[this.selectedIndexVideo].url);
      this.video = this.playlist[this.selectedIndexVideo];
      this.errorLoadVideo = false;
    }, 5000);
  }

  async getDataClip() {
    try {
      const storage = localStorage.getItem('allContent');
      if (storage) {
        console.log('getData Storage');
        this.video = JSON.parse(storage).find((video: { url: any }) => {
          return video.url === this.idVideo;
        });
        console.log(this.video);
      } else {
        this.video = await this.apiVald.getVideoByUrl(this.idVideo).subscribe({
          next: (video) => {
            this.video = video;
            console.log(this.video);
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

  getPlaylist() {
    try {
      const storage = localStorage.getItem('videosPlaylist');
      if (storage) {
        console.log('IN LOCAL STORAGE');

        this.playlist = JSON.parse(storage);
        this.selectedIndexVideo = this.playlist.findIndex((clip: any) => {
          return (
            clip.url.trim().toLowerCase() == this.idVideo.trim().toLowerCase()
          );
        });
        console.log(this.playlist.map((video: { name: any }) => video.name));
      } else {
        this.apiVald.getVideos().subscribe({
          next: (data) => {
            this.playlist = data.sort((a: any, b: any) => {
              // Comparaison par catégorie
              const categorySort = a.categorie.localeCompare(b.categorie);
              if (categorySort !== 0) return categorySort;

              // Comparaison par nom d'auteur
              const authorComparison = a.author.nameArtiste.localeCompare(
                b.author.nameArtiste
              );
              if (authorComparison !== 0) return authorComparison;

              // Comparaison par date (du plus ancien au plus récent)
              return new Date(a.date).getTime() - new Date(b.date).getTime();
            });
            console.log(
              this.playlist.map((video: { name: any }) => video.name)
            );
            this.selectedIndexVideo = this.playlist.findIndex((clip: any) => {
              return (
                clip.url.trim().toLowerCase() ==
                this.idVideo.trim().toLowerCase()
              );
            });

            localStorage.setItem(
              'videosPlaylist',
              JSON.stringify(this.playlist)
            );
          },
          error: (error) => {
            console.error(
              'Erreur lors de la récupération de la playlist',
              error
            );
          },
        });
      }
    } catch (error) {
      console.error('Erreur dans getPlaylist: ', error);
    }
  }

  initializeHoverStates() {
    const categories = ['author'];
    categories.forEach((category) => {
      const artists = this.video[category];
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
