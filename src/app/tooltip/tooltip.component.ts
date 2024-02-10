import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
})
export class TooltipComponent {
  @Input() data: any;
  @Input() isVisible: boolean = false;

  navigateToExternalLink(link: string) {
    window.open('https://' + link, '_blank');
  }
}
