import { Component } from '@angular/core';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-tierlist',
  templateUrl: './tierlist.component.html',
  styleUrl: './tierlist.component.scss',
})
export class TierlistComponent {
  backgroundImg: string = '../../assets/img/68.jpg';
  titreAlbum: string = '';
  imageBlob: Blob | null = null;

  albums = [
    {
      track: 1,
      title: 'Surprise',
      album: 'NQNTMQMQMB',
    },
    {
      track: 2,
      title: 'Journal Perso',
      album: 'NQNTMQMQMB',
    },
    {
      track: 3,
      title: 'Smiley',
      album: 'NQNTMQMQMB',
    },
    {
      track: 4,
      title: 'Lune',
      album: 'NQNTMQMQMB',
    },
    {
      track: 5,
      title: 'CQFD',
      album: 'NQNTMQMQMB',
    },
    {
      track: 6,
      title: 'Verre de sang',
      album: 'NQNTMQMQMB',
    },
    {
      track: 7,
      title: 'Elyxir',
      album: 'NQNTMQMQMB',
    },
    {
      track: 8,
      title: 'Winston',
      album: 'NQNTMQMQMB',
    },
    {
      track: 9,
      title: 'Evoluchienne',
      album: 'NQNTMQMQMB',
    },
    {
      track: 10,
      title: 'Pas grave',
      album: 'NQNTMQMQMB',
    },
    {
      track: 11,
      title: 'Guedin',
      album: 'NQNTMQMQMB',
    },
    {
      track: 12,
      title: 'Branleur',
      album: 'NQNTMQMQMB',
    },
    {
      track: 13,
      title: 'Lalala',
      album: 'NQNTMQMQMB',
    },
    {
      track: 14,
      title: 'Rockstar',
      album: 'NQNTMQMQMB',
    },
    {
      track: 15,
      title: 'Teh stylé',
      album: 'NQNTMQMQMB',
    },
    {
      track: 1,
      title: 'Mon présent',
      album: 'Cours de rattrapage',
    },
    {
      track: 2,
      title: 'Donkey Punch',
      album: 'Cours de rattrapage',
    },
    {
      track: 3,
      title: 'John Doe',
      album: 'Cours de rattrapage',
    },
    {
      track: 4,
      title: 'Cylindrique',
      album: 'Cours de rattrapage',
    },
    {
      track: 5,
      title: 'La ive',
      album: 'Cours de rattrapage',
    },
    {
      track: 6,
      title: 'NQNT',
      album: 'Cours de rattrapage',
    },
    {
      track: 7,
      title: 'Encore',
      album: 'Cours de rattrapage',
    },
    {
      track: 8,
      title: 'Hippopotomonstrosesquippedaliophobie',
      album: 'Cours de rattrapage',
    },
    {
      track: 9,
      title: 'Pour si peu',
      album: 'Cours de rattrapage',
    },
    {
      track: 10,
      title: 'Ass propos',
      album: 'Cours de rattrapage',
    },
    {
      track: 11,
      title: 'Bukkake',
      album: 'Cours de rattrapage',
    },
    {
      track: 12,
      title: 'Bad Trip',
      album: 'Cours de rattrapage',
    },
    {
      track: 13,
      title: 'Spirale',
      album: 'Cours de rattrapage',
    },
    {
      track: 14,
      title: 'Épices loufoques',
      album: 'Cours de rattrapage',
    },
    {
      track: 15,
      title: 'Que fait la police',
      album: 'Cours de rattrapage',
    },
    {
      track: 1,
      title: "C'est Pour",
      album: 'NQNT',
    },
    {
      track: 2,
      title: 'Par Toutatis',
      album: 'NQNT',
    },
    {
      track: 3,
      title: 'Shoot Un Ministre',
      album: 'NQNT',
    },
    {
      track: 4,
      title: 'Autiste',
      album: 'NQNT',
    },
    {
      track: 5,
      title: 'Sullyvan',
      album: 'NQNT',
    },
    {
      track: 6,
      title: 'Flowjob',
      album: 'NQNT',
    },
    {
      track: 7,
      title: 'Vie De Cochon',
      album: 'NQNT',
    },
    {
      track: 8,
      title: 'Horrible',
      album: 'NQNT',
    },
    {
      track: 9,
      title: 'Aulnay Sous Bois',
      album: 'NQNT',
    },
    {
      track: 10,
      title: 'Elle Me Regarde',
      album: 'NQNT',
    },
    {
      track: 1,
      title: 'Retour',
      album: 'NQNT 2',
    },
    {
      track: 2,
      title: 'Bonjour',
      album: 'NQNT 2',
    },
    {
      track: 3,
      title: 'Infanticide',
      album: 'NQNT 2',
    },
    {
      track: 4,
      title: 'Quidam',
      album: 'NQNT 2',
    },
    {
      track: 5,
      title: "Cartes sous l'coude",
      album: 'NQNT 2',
    },
    {
      track: 6,
      title: 'Urbanisme',
      album: 'NQNT 2',
    },
    {
      track: 7,
      title: 'Selfie',
      album: 'NQNT 2',
    },
    {
      track: 8,
      title: 'Barême',
      album: 'NQNT 2',
    },
    {
      track: 9,
      title: 'Taga',
      album: 'NQNT 2',
    },
    {
      track: 10,
      title: 'Promesse',
      album: 'NQNT 2',
    },
    {
      track: 11,
      title: 'Joffrey',
      album: 'NQNT 2',
    },
    {
      track: 1,
      title: 'Acacia',
      album: 'Agartha',
    },
    {
      track: 2,
      title: 'Megadose',
      album: 'Agartha',
    },
    {
      track: 3,
      title: "Si j'arrêtais",
      album: 'Agartha',
    },
    {
      track: 4,
      title: "Je t'aime",
      album: 'Agartha',
    },
    {
      track: 5,
      title: 'Totem',
      album: 'Agartha',
    },
    {
      track: 6,
      title: 'L.D.S',
      album: 'Agartha',
    },
    {
      track: 7,
      title: 'Ma meilleure amie',
      album: 'Agartha',
    },
    {
      track: 8,
      title: 'Neo',
      album: 'Agartha',
    },
    {
      track: 9,
      title: 'Lezarman',
      album: 'Agartha',
    },
    {
      track: 10,
      title: 'Blanc ft Suikon Blaz AD',
      album: 'Agartha',
    },
    {
      track: 11,
      title: 'Eurotrap',
      album: 'Agartha',
    },
    {
      track: 12,
      title: 'Petite chatte',
      album: 'Agartha',
    },
    {
      track: 13,
      title: 'Vitrine ft Damso',
      album: 'Agartha',
    },
    {
      track: 14,
      title: 'Strip',
      album: 'Agartha',
    },
    {
      track: 15,
      title: 'Kid Cudi',
      album: 'Agartha',
    },
    {
      track: 1,
      title: 'Berflam',
      album: 'NQNT 3',
    },
    {
      track: 2,
      title: 'Sombre soirée',
      album: 'NQNT 3',
    },
    {
      track: 3,
      title: 'Symphonie',
      album: 'NQNT 3',
    },
    {
      track: 4,
      title: 'Baby Squirt',
      album: 'NQNT 3',
    },
    {
      track: 5,
      title: 'Foie gras',
      album: 'NQNT 3',
    },
    {
      track: 6,
      title: 'Baraccuda',
      album: 'NQNT 3',
    },
    {
      track: 7,
      title: 'Jean Teh',
      album: 'NQNT 3',
    },
    {
      track: 8,
      title: 'Accordé',
      album: 'NQNT 3',
    },
    {
      track: 9,
      title: 'Maya',
      album: 'NQNT 3',
    },
    {
      track: 10,
      title: 'Pas comme eux',
      album: 'NQNT 3',
    },
    {
      track: 11,
      title: 'Pentacle et bougie',
      album: 'NQNT 3',
    },
    {
      track: 12,
      title: 'Possédé Framboise',
      album: 'NQNT 3',
    },
    {
      track: 13,
      title: 'Mana',
      album: 'NQNT 3',
    },
    {
      track: 1,
      title: 'Primitif',
      album: 'Xeu',
    },
    {
      track: 2,
      title: 'Seum',
      album: 'Xeu',
    },
    {
      track: 3,
      title: 'DQTP',
      album: 'Xeu',
    },
    {
      track: 4,
      title: 'Possédé',
      album: 'Xeu',
    },
    {
      track: 5,
      title: 'Chépakichui',
      album: 'Xeu',
    },
    {
      track: 6,
      title: 'Résidus',
      album: 'Xeu',
    },
    {
      track: 7,
      title: 'Jentertain',
      album: 'Xeu',
    },
    {
      track: 8,
      title: 'Rituel ft Sirius',
      album: 'Xeu',
    },
    {
      track: 9,
      title: 'Désaccordé',
      album: 'Xeu',
    },
    {
      track: 10,
      title: 'Gris',
      album: 'Xeu',
    },
    {
      track: 11,
      title: 'Réflexions basses',
      album: 'Xeu',
    },
    {
      track: 12,
      title: 'Offshore ft Suikon Blaz AD',
      album: 'Xeu',
    },
    {
      track: 13,
      title: 'Ne me déteste pas',
      album: 'Xeu',
    },
    {
      track: 14,
      title: 'Rocking Chair',
      album: 'Xeu',
    },
    {
      track: 15,
      title: 'Dragon ft Sofiane',
      album: 'Xeu',
    },
    {
      track: 1,
      title: 'Non stop',
      album: 'NQNT 33',
    },
    {
      track: 2,
      title: 'YAX3',
      album: 'NQNT 33',
    },
    {
      track: 3,
      title: 'Berflam',
      album: 'NQNT 33',
    },
    {
      track: 4,
      title: 'Rhumance',
      album: 'NQNT 33',
    },
    {
      track: 5,
      title: 'Dis moi tout BB (Suikon Blaz AD)',
      album: 'NQNT 33',
    },
    {
      track: 6,
      title: 'Foie gras',
      album: 'NQNT 33',
    },
    {
      track: 7,
      title: 'No Tube Zone',
      album: 'NQNT 33',
    },
    {
      track: 8,
      title: 'Mana',
      album: 'NQNT 33',
    },
    {
      track: 9,
      title: 'Vlad',
      album: 'NQNT 33',
    },
    {
      track: 10,
      title: 'MacDo',
      album: 'NQNT 33',
    },
    {
      track: 11,
      title: 'Baby Squirt',
      album: 'NQNT 33',
    },
    {
      track: 12,
      title: 'Champignon (Sirius)',
      album: 'NQNT 33',
    },
    {
      track: 13,
      title: 'Kamasutra',
      album: 'NQNT 33',
    },
    {
      track: 14,
      title: 'Sombre soirée',
      album: 'NQNT 33',
    },
    {
      track: 15,
      title: 'Possédé - Remix',
      album: 'NQNT 33',
    },
    {
      track: 1,
      title: 'Poches pleines',
      album: 'Ce monde est cruel',
    },
    {
      track: 2,
      title: 'NQNTMQMQMB',
      album: 'Ce monde est cruel',
    },
    {
      track: 3,
      title: 'Journal perso 2',
      album: 'Ce monde est cruel',
    },
    {
      track: 4,
      title: 'Ce monde est cruel',
      album: 'Ce monde est cruel',
    },
    {
      track: 5,
      title: 'Pensionman',
      album: 'Ce monde est cruel',
    },
    {
      track: 6,
      title: 'Ma star',
      album: 'Ce monde est cruel',
    },
    {
      track: 7,
      title: 'Ignorant',
      album: 'Ce monde est cruel',
    },
    {
      track: 8,
      title: 'Halloween',
      album: 'Ce monde est cruel',
    },
    {
      track: 9,
      title: 'Dernier retrait ft SCH',
      album: 'Ce monde est cruel',
    },
    {
      track: 10,
      title: 'Keskivonfer',
      album: 'Ce monde est cruel',
    },
    {
      track: 11,
      title: 'Pourquoi',
      album: 'Ce monde est cruel',
    },
    {
      track: 12,
      title: "J'pourrai",
      album: 'Ce monde est cruel',
    },
    {
      track: 13,
      title: 'No Friends',
      album: 'Ce monde est cruel',
    },
    {
      track: 14,
      title: 'ASB ft Maes',
      album: 'Ce monde est cruel',
    },
    {
      track: 15,
      title: 'Royal Bacon',
      album: 'Ce monde est cruel',
    },
    {
      track: 1,
      title: 'Mélange',
      album: 'Horizon Vertical',
    },
    {
      track: 2,
      title: 'Horizon vertical',
      album: 'Horizon Vertical',
    },
    {
      track: 3,
      title: 'Matrixé',
      album: 'Horizon Vertical',
    },
    {
      track: 4,
      title: 'Canada',
      album: 'Horizon Vertical',
    },
    {
      track: 5,
      title: 'Mauvais',
      album: 'Horizon Vertical',
    },
    {
      track: 6,
      title: '1992',
      album: 'Horizon Vertical',
    },
    {
      track: 7,
      title: 'Diviser pour mieux régner',
      album: 'Horizon Vertical',
    },
    {
      track: 8,
      title: 'Royal cheese',
      album: 'Horizon Vertical',
    },
    {
      track: 9,
      title: 'Guccissima',
      album: 'Horizon Vertical',
    },
    {
      track: 10,
      title: 'VHR',
      album: 'Horizon Vertical',
    },
    {
      track: 11,
      title: '2014',
      album: 'Horizon Vertical',
    },
    {
      track: 1,
      title: 'Pandémie',
      album: 'V',
    },
    {
      track: 2,
      title: 'La faux le fer',
      album: 'V',
    },
    {
      track: 3,
      title: 'Sur un nouvel album',
      album: 'V',
    },
    {
      track: 4,
      title: 'Un mot',
      album: 'V',
    },
    {
      track: 5,
      title: 'Péon ft Orelsan',
      album: 'V',
    },
    {
      track: 6,
      title: 'Papoose',
      album: 'V',
    },
    {
      track: 7,
      title: 'Je ressens rien',
      album: 'V',
    },
    {
      track: 8,
      title: 'Rappeur conscient',
      album: 'V',
    },
    {
      track: 9,
      title: 'Maudit ft Hamza',
      album: 'V',
    },
    {
      track: 10,
      title: 'Regarde toi',
      album: 'V',
    },
    {
      track: 11,
      title: 'Qui écoute ?',
      album: 'V',
    },
    {
      track: 12,
      title: 'Pas deux fois',
      album: 'V',
    },
    {
      track: 13,
      title: 'Anunnaki',
      album: 'V',
    },
    {
      track: 14,
      title: 'Laisse tomber',
      album: 'V',
    },
    {
      track: 1,
      title: 'Forfait',
      album: 'VV5',
    },
    {
      track: 2,
      title: 'Satan 3',
      album: 'VV5',
    },
    {
      track: 3,
      title: 'Show',
      album: 'VV5',
    },
    {
      track: 4,
      title: 'Echelon Freestyle ft Yonidas Rafal Charles Bdl & Suikon',
      album: 'VV5',
    },
    {
      track: 5,
      title: 'Feelings',
      album: 'VV5',
    },
    {
      track: 6,
      title: 'Technique',
      album: 'VV5',
    },
    {
      track: 7,
      title: 'Ruff Ryderz',
      album: 'VV5',
    },
    {
      track: 8,
      title: 'Bad',
      album: 'VV5',
    },
    {
      track: 9,
      title: 'Tellement toi ft Suikon Blaz AD',
      album: 'VV5',
    },
    {
      track: 10,
      title: 'Réflexions très basses',
      album: 'VV5',
    },
    {
      track: 11,
      title: 'Aucun retour',
      album: 'VV5',
    },
    {
      track: 12,
      title: 'Microphone check',
      album: 'VV5',
    },
  ];

  YourBestAlbum: any[] = [];
  outroAlbum: any[] = [
    {
      track: 17,
      title: 'Metafion',
      album: 'NQNTMQMQMB',
    },
    {
      track: 18,
      title: 'V.A.L.S.E',
      album: 'Cours de rattrapage',
    },
    {
      track: 11,
      title: 'Smiley',
      album: 'NQNT',
    },
    {
      track: 12,
      title: 'Ogre',
      album: 'NQNT 2',
    },
    {
      track: 17,
      title: 'Dernier verre',
      album: 'Agartha',
    },
    {
      track: 14,
      title: 'Trophée (Démo)',
      album: 'NQNT 3',
    },
    {
      track: 16,
      title: 'Deviens génial',
      album: 'Xeu',
    },
    {
      track: 16,
      title: 'Rechute',
      album: 'NQNT 33',
    },
    {
      track: 16,
      title: 'Rappel',
      album: 'Ce monde est cruel',
    },
    {
      track: 12,
      title: 'Adios',
      album: 'Horizon Vertical',
    },
    {
      track: 14,
      title: 'Happy End ft Suikon Blaz AD',
      album: 'V',
    },
    {
      track: 13,
      title: 'Sushi',
      album: 'VV5',
    },
  ];

  BonusAlbum: any[] = [
    {
      track: 1,
      title: 'PF',
      album: 'NQNT',
    },
    {
      track: 2,
      title: 'CQFD',
      album: 'NQNT',
    },
    {
      track: 1,
      title: 'Trophée',
      album: 'Xeu',
    },
    {
      track: 14,
      title: 'Casimir',
      album: 'CMEC rouge',
    },
    {
      track: 14,
      title: 'Doli',
      album: 'CMEC bleu',
    },
    {
      track: 14,
      title: 'Persuadé',
      album: 'CMEC vert',
    },
    {
      track: 14,
      title: 'Gringo envoie un mess',
      album: 'CMEC violet',
    },
    {
      track: 14,
      title: 'Bien sûr',
      album: 'V',
    },
    {
      track: 14,
      title: 'Cafards',
      album: 'V1',
    },
    {
      track: 14,
      title: 'Vert de rage',
      album: 'V1',
    },
    {
      track: 14,
      title: 'La machine',
      album: 'V2',
    },
    {
      track: 14,
      title: 'Chu immunisé',
      album: 'V2',
    },
    {
      track: 14,
      title: 'Nouvelle industrie',
      album: 'V3',
    },
    {
      track: 14,
      title: 'PAW !',
      album: 'V3',
    },
    {
      track: 14,
      title: 'Ce soir',
      album: 'V4',
    },
    {
      track: 14,
      title: 'Le blues du péon',
      album: 'V4',
    },
    {
      track: 14,
      title: 'Hottest',
      album: 'VV5',
    },
  ];
  menu: boolean = true;
  quizz: boolean = false;
  answer: boolean = false;
  currentTrack: number = 1;
  public StartQuizz() {
    this.menu = false;
    this.quizz = true;
  }

  filteredTracks() {
    const filteredTracks = this.albums.filter(
      (album) => album.track === this.currentTrack
    );
    if (this.currentTrack === 16) {
      return this.outroAlbum;
    } else {
      if (this.currentTrack === 17) {
        return this.BonusAlbum;
      }
      return this.albums.filter((tracks) => tracks.track === this.currentTrack);
    }
  }

  chooseTrack(track: any) {
    const isNotOutro = this.albums.find((album) => album === track);
    const isOutro = this.outroAlbum.find((outroAlbum) => outroAlbum === track);
    if (isNotOutro) {
      this.YourBestAlbum.push(track);
    } else {
      if (isOutro) {
        this.YourBestAlbum.push(track);
      } else {
        this.YourBestAlbum.push(track);
        this.answer = true;
      }
    }
    this.currentTrack++;
  }
  changeBackgroundImg(src: string) {
    this.backgroundImg = src;
  }

  generateAndShareImage() {
    const bestAlbum = document.querySelector('.best-album');
  
    if (bestAlbum) {
      html2canvas(bestAlbum as HTMLElement).then(canvas => {
        // Convertir le canvas en Blob
        canvas.toBlob(blob => {
          if (blob) {
            // Créer un objet File à partir du Blob
            const file = new File([blob], 'best_album_VALD.png', { type: 'image/png' });
  
            // Partager l'image
            if (navigator.share) {
              navigator.share({
                title: 'L\'album parfait de VALD',
                text: 'Voici mon album parfait de VALD!',
                files: [file]
              }).then(() => console.log('Image partagée avec succès'))
                .catch(error => console.error('Erreur lors du partage :', error));
            } else {
              console.error('L\'API Web Share n\'est pas prise en charge dans ce navigateur.');
            }
          } else {
            console.error('Échec de la génération de l\'image.');
          }
        }, 'image/png');
      });
    } else {
      console.error('Best album not found');
    }
  }

  generateImage() {
    const bestAlbum = document.querySelector('.best-album');
  
    html2canvas(bestAlbum as HTMLElement).then(canvas => {
      // Convertir le canvas en URL de données
      const dataURL = canvas.toDataURL('image/png');
  
      // Créer un élément <a> pour télécharger l'image
      const link = document.createElement('a');
      link.download = 'best_album_vald.png';
      link.href = dataURL;
  
      // Cliquez sur le lien pour télécharger l'image
      link.click();
    });
  }
}
