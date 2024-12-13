import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  @ViewChild('toast', { static: true }) toast!: ElementRef;
  @ViewChild('toastProgressBar', { static: true })
  toastProgressBar!: ElementRef;
  nameVideo: any;
  toastTimeout!: any;
  @Input() video: any;
  @Output() onActionConfirmed = new EventEmitter<void>();
  @Output() onUndoAction = new EventEmitter<void>();

  showToast(video: any) {
    this.video = video;
    this.nameVideo = video.name;
    console.log(this.video.name);
    if (this.toast.nativeElement.classList.contains('cart-toast--show')) {
      clearTimeout(this.toastTimeout);
      this.resetProgressBar();
    } else {
      this.toast.nativeElement.classList.add('cart-toast--show');
      this.resetProgressBar();
    }

    this.toastTimeout = setTimeout(() => {
      this.toast.nativeElement.classList.remove('cart-toast--show');
      this.toastProgressBar.nativeElement.style.transition = 'transform 0s 1s linear';
      this.toastProgressBar.nativeElement.style.transform = 'scaleX(0)';
      this.onActionConfirmed.emit();
    }, 4000);
  }

  resetProgressBar() {
    const progressBar = this.toastProgressBar.nativeElement;
    progressBar.style.transition = 'none';
    progressBar.style.transform = 'scaleX(0)';
    progressBar.offsetWidth; // Force reflow
    progressBar.style.transition = 'transform 4s linear';
    progressBar.style.transform = 'scaleX(1)';
  }

  onUndo() {
    clearTimeout(this.toastTimeout);
    this.toast.nativeElement.classList.remove('cart-toast--show');
    this.onUndoAction.emit();
  }
}
