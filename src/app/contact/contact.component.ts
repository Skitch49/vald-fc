import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiValdService } from '../services/api-vald.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subscription } from 'rxjs';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private apiVald: ApiValdService,
    private recaptchaV3Service: ReCaptchaV3Service,
    @Inject(DOCUMENT) private _document: any,
    @Inject(PLATFORM_ID) private _platformId: any
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._document.body.classList.add('recaptcha');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (isPlatformBrowser(this._platformId)) {
      this._document.body.classList.remove('recaptcha');
    }
  }

  get Name() {
    return this.formContact.get('name');
  }
  get FirstName() {
    return this.formContact.get('firstName');
  }
  get Email() {
    return this.formContact.get('email');
  }
  get Message() {
    return this.formContact.get('message');
  }

  public formContact: FormGroup = this.fb.group({
    name: [
      '',
      Validators.compose([Validators.required, Validators.minLength(2)]),
    ],
    firstName: [
      '',
      Validators.compose([Validators.required, Validators.minLength(2)]),
    ],
    email: [
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
      ]),
    ],
    message: [
      '',
      Validators.compose([Validators.required, Validators.minLength(8)]),
    ],
  });

  public submit() {
    const recaptchaSubscription = this.recaptchaV3Service
      .execute('importantAction')
      .subscribe((token: string) => {
        if (this.formContact.valid) {
          const data = {
            name: this.Name?.value,
            firstName: this.FirstName?.value,
            email: this.Email?.value,
            message: this.Message?.value,
          };
          console.log(data);
          this.apiVald.postMail(data).subscribe();
          this.formContact.reset();
        } else {
          console.log(
            'Erreur dans le formulaire. Veuillez remplir tout les champs nécéssaires !'
          );
        }
      });

    this.subscription.add(recaptchaSubscription);
  }
}
