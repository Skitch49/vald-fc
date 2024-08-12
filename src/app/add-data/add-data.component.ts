import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiValdService } from '../services/api-vald.service';

export interface Artiste {
  _id: string;
  nameArtiste: string;
  socialMedia: {
    instagram: string;
    twitter: string;
    snap: string;
    tiktok: string;
    facebook: string;
    youtube: string;
  };
}
@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrl: './add-data.component.scss',
})
export class AddDataComponent {
  artistes: Artiste[] = [];
  data: any = {};
  selectVideo: String = 'clip';
  categories: any[] = [];
  otherIsSelected: boolean = false;

  constructor(private fb: FormBuilder, private apiVald: ApiValdService) {}

  onCategorieChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.otherIsSelected = selectedValue === 'other';
    if ((this.otherIsSelected = selectedValue === 'other')) {
      this.getData();
    }
  }

  //getter
  get name() {
    if (this.selectVideo == 'clip') {
      return this.formClip.get('name');
    } else {
      return this.formInterview.get('name');
    }
  }
  get nameArtiste() {
    return this.formArtiste.get('nameArtiste');
  }
  get date() {
    if (this.selectVideo == 'clip') {
      return this.formClip.get('date');
    } else {
      return this.formInterview.get('date');
    }
  }
  get description() {
    if (this.selectVideo == 'clip') {
      return this.formClip.get('description');
    } else {
      return this.formInterview.get('description');
    }
  }
  get url() {
    if (this.selectVideo == 'clip') {
      return this.formClip.get('url');
    } else {
      return this.formInterview.get('url');
    }
  }
  get author() {
    return this.formInterview.get('author');
  }
  get categorie() {
    if (this.selectVideo == 'clip') {
      return this.formClip.get('categorie');
    } else {
      return this.formInterview.get('categorie');
    }
  }
  get newCategorie() {
    if (this.selectVideo == 'clip') {
      return this.formClip.get('newCategorie');
    } else {
      return this.formInterview.get('newCategorie');
    }
  }
  get produced() {
    return this.formClip.get('produced');
  }
  get mix() {
    return this.formClip.get('mix');
  }
  get mastering() {
    return this.formClip.get('mastering');
  }
  get production() {
    return this.formClip.get('production');
  }
  get real() {
    return this.formClip.get('real');
  }
  get featuring() {
    return this.formClip.get('featuring') as FormArray;
  }
  get artiste() {
    return this.formClip.get('artiste');
  }
  get instagram() {
    return this.formArtiste.get('socialMedia.instagram');
  }
  get twitter() {
    return this.formArtiste.get('socialMedia.twitter');
  }
  get snap() {
    return this.formArtiste.get('socialMedia.snap');
  }
  get tiktok() {
    return this.formArtiste.get('socialMedia.tiktok');
  }
  get facebook() {
    return this.formArtiste.get('socialMedia.facebook');
  }
  get youtube() {
    return this.formArtiste.get('socialMedia.youtube');
  }
  get twitch() {
    return this.formArtiste.get('socialMedia.twitch');
  }

  ngOnInit() {
    this.getAuthor();
    this.getData();
    this.SelectVideo(this.selectVideo);
    this.formInterview.valueChanges.subscribe((value) => {
      if (this.selectVideo == 'interview') {
        this.data = value;
        this.getData();
      }
    });

    this.formClip.valueChanges.subscribe((value) => {
      if (this.selectVideo == 'clip') {
        this.data = value;
        this.getData();
      }
    });

    this.formArtiste.valueChanges.subscribe((value) => {
      if (this.selectVideo == 'artiste') {
        this.data = value;
      }
    });
  }

  getData() {
    if (this.selectVideo == 'interview') {
      this.data = {
        name: this.name?.value,
        date: this.date?.value,
        description: this.description?.value,
        url: this.url?.value,
        author: this.author?.value,
        categorie: this.newCategorie?.value
          ? this.newCategorie?.value
          : this.categorie?.value,
      };
    }
    if (this.selectVideo == 'clip') {
      this.data = {
        name: this.name?.value,
        date: this.date?.value,
        description: this.description?.value,
        url: this.url?.value,
        categorie: this.newCategorie?.value
          ? this.newCategorie?.value
          : this.categorie?.value,
        produced: this.produced?.value,
        mix: this.mix?.value,
        mastering: this.mastering?.value,
        production: this.production?.value,
        real: this.real?.value,
        artiste: this.artiste?.value,
        featuring: this.featuring?.value ? this.featuring?.value: '',
      };
    }
    if (this.selectVideo == 'artiste') {
      this.data = {
        nameArtiste: this.name?.value,
        socialMedia: {
          instagram: this.instagram?.value,
          twitter: this.twitter?.value,
          snap: this.snap?.value,
          tiktok: this.tiktok?.value,
          facebook: this.facebook?.value,
          youtube: this.youtube?.value,
          twitch: this.twitch?.value,
        },
      };
    }
  }

  getAuthor() {
    this.apiVald.getArtistes().subscribe((data) => {
      this.artistes = data.sort((a: Artiste, b: Artiste) =>
        a.nameArtiste.localeCompare(b.nameArtiste)
      );
    });
  }

  SelectVideo(type: String) {
    this.selectVideo = type;
    if (this.selectVideo == 'interview') {
      this.getInterviewAndCategories();
      this.getData();
    }
    if (this.selectVideo == 'clip') {
      this.getClipsAndCategories();
      this.getData();
    }
  }

  getClipsAndCategories() {
    this.apiVald.getClips().subscribe((datas) => {
      datas.forEach((data: any) => {
        if (data.categorie && !this.categories.includes(data.categorie)) {
          this.categories.push(data.categorie);
        }
      });
    });
  }

  getInterviewAndCategories() {
    this.apiVald.getVideos().subscribe((datas) => {
      datas.forEach((data: any) => {
        if (data.categorie && !this.categories.includes(data.categorie)) {
          this.categories.push(data.categorie);
        }
      });
    });
  }

  addFeaturing() {
    this.featuring.push(this.fb.control(''));
  }

  removeFeaturing(index: number) {
    this.featuring.removeAt(index);
  }

  public formInterview: FormGroup = this.fb.group({
    name: [
      '',
      Validators.compose([Validators.required, Validators.minLength(6)]),
    ],
    date: ['', Validators.required],
    description: [
      '',
      Validators.compose([Validators.required, Validators.minLength(12)]),
    ],
    url: [
      '',
      Validators.compose([Validators.required, Validators.minLength(5)]),
    ],
    author: ['', Validators.required],
    categorie: [
      '',
      Validators.compose([Validators.required, Validators.minLength(5)]),
    ],
    newCategorie: [''],
  });

  public formClip: FormGroup = this.fb.group({
    name: [
      '',
      Validators.compose([Validators.required, Validators.minLength(6)]),
    ],
    date: ['', Validators.required],
    description: [
      '',
      Validators.compose([Validators.required, Validators.minLength(12)]),
    ],
    url: [
      '',
      Validators.compose([Validators.required, Validators.minLength(5)]),
    ],
    categorie: [
      '',
      Validators.compose([Validators.required, Validators.minLength(5)]),
    ],
    produced: [''],
    mix: [''],
    mastering: [''],
    production: [''],
    real: [''],
    artiste: ['', Validators.required],
    featuring: this.fb.array([this.fb.control('')]),
    newCategorie: [''],
  });

  public formArtiste: FormGroup = this.fb.group({
    nameArtiste: [
      '',
      Validators.compose([Validators.required, Validators.minLength(2)]),
    ],
    socialMedia: this.fb.group({
      instagram: [''],
      twitter: [''],
      snap: [''],
      tiktok: [''],
      facebook: [''],
      youtube: [''],
      twitch: [''],
    }),
  });

  cleanSocialMediaLinks(data: any) {
    const socialMediaFields = [
      'instagram',
      'twitter',
      'snap',
      'tiktok',
      'facebook',
      'youtube',
      'twitch',
    ];
    socialMediaFields.forEach((field) => {
      if (data.socialMedia && data.socialMedia[field]) {
        data.socialMedia[field] = data.socialMedia[field].replace(
          /^https?:\/\//,
          ''
        );
      }
      return data;
    });
  }

  public submit() {
    if (this.selectVideo == 'interview') {
      if (this.formInterview.valid) {
        this.apiVald.postVideo(this.data).subscribe(
          (data) => {
            console.log('Interview créer :', data);
            this.categories = [];
            this.getInterviewAndCategories();
          },
          (error) => console.log('Erreur lors de la création :', error)
        );
        this.formInterview.reset();
      }
    }
    if (this.selectVideo == 'clip') {
      if (this.formClip.valid) {

        this.apiVald.postClip(this.data).subscribe(
          (data) => {
            console.log('Clip créer :', data);
            this.categories = [];
            this.getClipsAndCategories();
            this.formClip.reset();
          },
          (error) => {
            console.log('Erreur lors de la création :', error),
              console.log('Clip :', this.data);
          }
        );
      }
    }
    if (this.selectVideo == 'artiste') {
      if (this.formArtiste.valid) {
        this.cleanSocialMediaLinks(this.data);

        this.apiVald.postArtiste(this.data).subscribe(
          (data) => {
            console.log('Artiste créer :', data);
            this.formArtiste.reset();
            this.getAuthor();
          },
          (error) => {
            console.log('Erreur lors de la création :', error),
              console.log('Artiste :', this.data);
          }
        );
      }
    }
  }
}
