import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss',
})
export class ToggleComponent implements AfterViewInit {
  @ViewChild('input') inputElement!: any;
  @Input() checked!: boolean;
  @Input() nameLabelForTrue!: string;
  @Input() nameLabelForFalse!: string;
  @Output() toggle = new EventEmitter<boolean>();

  ngAfterViewInit(): void {
    console.log(this.checked);
    if (this.inputElement) {
      this.inputElement.nativeElement.checked = this.checked;
    }
  }

  switchToggle() {
    this.checked = !this.checked;
    this.toggle.emit(this.checked);
  }
}
