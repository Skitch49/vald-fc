import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiValdService } from '../services/api-vald.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

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
  recupData: any = {};
  typeVideoRecupData: String = '';
  IdRecupData: String = '';
  selectVideo: String = 'clip';
  categories: any[] = [];
  otherIsSelected: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiVald: ApiValdService,
    private activatedRoute: ActivatedRoute,
    private route: Router
  ) {}

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
    return this.formClip.get('produced') as FormArray;
  }
  get mix() {
    return this.formClip.get('mix') as FormArray;
  }
  get mastering() {
    return this.formClip.get('mastering');
  }
  get production() {
    return this.formClip.get('production') as FormArray;
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

    this.formInterview.valueChanges.subscribe((value) => {
      if (this.selectVideo === 'interview') {
        this.data = value;
        this.getData();
      }
    });

    this.formClip.valueChanges.subscribe((value) => {
      if (this.selectVideo === 'clip') {
        this.data = value;
        this.getData();
      }
    });

    this.formArtiste.valueChanges.subscribe((value) => {
      if (this.selectVideo === 'artiste') {
        this.data = value;
      }
    });

    this.activatedRoute.paramMap.subscribe((params) => {
      const data = params.get('data');
      if (data) {
        this.recupData = JSON.parse(data);
        this.typeVideoRecupData = this.recupData[1];
        this.selectVideo = this.typeVideoRecupData;
        this.IdRecupData = this.recupData[0]._id;
        this.recupData._id = this.IdRecupData;

        this.recupData = this.recupData[0];

        if (this.recupData.date) {
          const date = new Date(this.recupData.date);
          const formattedDate = date.toISOString().split('T')[0]; // format yyyy-MM-dd
          this.recupData.date = formattedDate;
        }

        if (this.selectVideo === 'interview') {
          this.getInterviewAndCategories();

          const author = this.recupData.author._id;
          this.recupData.author = author;
          console.log(this.recupData);
          this.formInterview.patchValue(this.recupData);
        } else if (this.selectVideo === 'clip') {
          this.getClipsAndCategories();

          this.updateFormArray(
            this.formClip.get('produced') as FormArray,
            this.extractIds(this.recupData.produced || [''])
          );

          this.updateFormArray(
            this.formClip.get('mix') as FormArray,
            this.extractIds(this.recupData.mix || [''])
          );
          this.updateFormArray(
            this.formClip.get('production') as FormArray,
            this.extractIds(this.recupData.production || [''])
          );
          this.updateFormArray(
            this.formClip.get('featuring') as FormArray,
            this.extractIds(this.recupData.featuring || [''])
          );

          if (this.recupData.real) {
            var real = this.recupData.real._id;
          }
          if (this.recupData.mastering) {
            var mastering = this.recupData.mastering._id;
          }

          const artiste = this.recupData.artiste._id;
          if (this.recupData.produced) {
            var produced = this.recupData.produced.forEach(
              (element: { _id: any }) => {
                return element._id;
              }
            );
          }

          if (this.recupData.mix) {
            var mix = this.recupData.produced.forEach(
              (element: { _id: any }) => {
                return element._id;
              }
            );
          }
          if (this.recupData.featuring) {
            var featuring = this.recupData.featuring.forEach(
              (element: { _id: any }) => {
                return element._id;
              }
            );
          }
          if (this.recupData.production) {
            var production = this.recupData.production.forEach(
              (element: { _id: any }) => {
                return element._id;
              }
            );
          }

          this.recupData.real = real;
          this.recupData.mastering = mastering;
          this.recupData.artiste = artiste;
          this.recupData.produced = produced;
          this.recupData.mix = mix;
          this.recupData.production = production;
          this.recupData.featuring = featuring;
          console.log('fin' + this.recupData);
          this.formClip.patchValue(this.recupData);
        } else if (this.selectVideo === 'artiste') {
          this.formArtiste.patchValue(this.recupData);
        }
      } else {
        this.SelectVideo(this.selectVideo);
      }
    });
  }

  private updateFormArray(formArray: FormArray, values: any[]) {
    formArray.clear();
    values.forEach((value) => {
      formArray.push(this.fb.control(value));
    });
  }
  private extractIds(objects: any[]): string[] {
    return objects.map((obj) => obj._id);
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
        featuring: this.featuring?.value ? this.featuring?.value : '',
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
    if (this.recupData) {
      this.data._id = this.IdRecupData;
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
    this.categories = [];
    this.getData();

    if (this.selectVideo === 'interview') {
      this.getInterviewAndCategories();
    } else if (this.selectVideo === 'clip') {
      this.getClipsAndCategories();
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

  addMix() {
    this.mix.push(this.fb.control(''));
  }

  removeMix(index: number) {
    this.mix.removeAt(index);
  }

  addProduced() {
    this.produced.push(this.fb.control(''));
  }

  removeProduced(index: number) {
    this.produced.removeAt(index);
  }

  addProduction() {
    this.production.push(this.fb.control(''));
  }

  removeProduction(index: number) {
    this.production.removeAt(index);
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
      Validators.compose([Validators.required, Validators.minLength(4)]),
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
      Validators.compose([Validators.required, Validators.minLength(4)]),
    ],
    mastering: [''],
    real: [''],
    artiste: ['', Validators.required],
    produced: this.fb.array([this.fb.control('')]),
    mix: this.fb.array([this.fb.control('')]),
    production: this.fb.array([this.fb.control('')]),
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
    console.log('submit enter');
    if (this.IdRecupData !== '') {
      console.log('Bad enter');

      if (
        this.selectVideo == 'interview' &&
        this.typeVideoRecupData == 'interview'
      ) {
        if (this.formInterview.valid) {
          console.log('form valid');
          console.log(`${JSON.stringify(this.data)}`);
          this.apiVald.editVideo(this.data).subscribe(
            (data) => {
              console.log('Interview mis à jour :', data);
              this.formInterview.reset();
              this.route.navigate(['/dashboard']);
            },
            (error) =>
              console.log('Erreur lors de la mise à jour de la vidéo :', error)
          );
          this.formInterview.reset();
        }
      }
      if (this.selectVideo == 'clip' && this.typeVideoRecupData == 'clip') {
        if (this.formClip.valid) {
          console.log(`${this.data}`);

          this.apiVald.editClip(this.data).subscribe(
            (data) => {
              console.log('Clip mis à jour :', data);
              this.formClip.reset();
              this.route.navigate(['/dashboard']);
            },
            (error) => {
              console.log('Erreur lors de la mise à jour du clip :', error),
                console.log('Clip :', this.data);
            }
          );
        }
      }
      // A configurer l'api avant puis changer la route
      // if (
      //   this.selectVideo == 'artiste' &&
      //   this.typeVideoRecupData == 'artiste'
      // ) {
      //   if (this.formArtiste.valid) {
      //     this.cleanSocialMediaLinks(this.data);

      //     this.apiVald.postArtiste(this.data).subscribe(
      //       (data) => {
      //         console.log('Artiste créer :', data);
      //         this.formArtiste.reset();
      //         this.getAuthor();
      //       },
      //       (error) => {
      //         console.log('Erreur lors de la création :', error),
      //           console.log('Artiste :', this.data);
      //       }
      //     );
      //   }
      // }
    } else {
      console.log('else enter');
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
        console.log('Artiste enter');

        if (this.formArtiste.valid) {
          console.log('Form Valid');

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
}
