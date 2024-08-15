import {
  AfterContentInit,
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ApiValdService } from '../services/api-vald.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  clips: any;
  originalClips: any[] = [];
  interviews: any;
  originalInterviews: any[] = [];
  table: any = '';
  topbar: any = '';
  selectVideo: String = 'clip';
  sortColumn: string = '';
  sortDirection: number = 0; // 0: no sort, 1: ascending, -1: descending
  resizeObserver: ResizeObserver | undefined;

  constructor(private apiVald: ApiValdService, private router: Router) {}

  ngOnInit() {
    this.SelectVideo(this.selectVideo);
  }

  getData(i: any) {
    if (this.selectVideo == 'interview') {
      const data = [this.interviews[i], this.selectVideo];
      this.router.navigate(['/add-data', JSON.stringify(data)]);
    } else if (this.selectVideo == 'clip') {
      const data = [this.clips[i], this.selectVideo];
      this.router.navigate(['/add-data', JSON.stringify(data)]);
    }
  }

  ngAfterViewInit(): void {
    this.table = document.querySelector('thead');
    this.topbar = document.querySelector('.topbar');

    if (this.table && this.topbar) {
      this.resizeObserver = new ResizeObserver(() => {
        this.sizeTopBar();
      });
      this.resizeObserver.observe(this.table);
    }
    this.sizeTopBar();
  }
  ngOnDestroy() {
    if (this.resizeObserver && this.table) {
      this.resizeObserver.unobserve(this.table);
      this.resizeObserver.disconnect();
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.sizeTopBar();
  }
  sizeTopBar() {
    if (this.table && this.topbar) {
      let widthTable = this.table.offsetWidth;
      this.topbar.style.width = widthTable + 'px';
    }
  }
  toFromAddData() {
    this.router.navigate(['/add-data']);
  }
  getAllClips() {
    this.apiVald.getClips().subscribe((data) => {
      this.clips = data;
      this.originalClips = [...data];
      this.sortData();
    });
  }
  getAllInterviews() {
    this.apiVald.getVideos().subscribe((data) => {
      this.interviews = data;
      this.originalInterviews = [...data];
      this.sortData();
    });
  }

  SelectVideo(value: String) {
    if (value == 'clip') {
      this.selectVideo = value;
      this.getAllClips();
    } else {
      this.selectVideo = value;
      this.getAllInterviews();
    }
  }

  toggleSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = ((this.sortDirection + 2) % 3) - 1; // cycles through 0, 1, -1
    } else {
      this.sortColumn = column;
      this.sortDirection = 1;
    }
    this.sortData();
  }
  normalizeString(str: string): string {
    return str
      .normalize('NFD') // Decompose the characters into base characters and accents
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .toLowerCase(); // Convert to lowercase
  }
  sortData() {
    if (this.sortDirection === 0) {
      this.clips = this.originalClips.slice();
      this.interviews = this.originalInterviews.slice();
      return;
    }

    const data = this.selectVideo === 'clip' ? this.clips : this.interviews;
    data.sort((a: any, b: any) => {
      let valueA = a[this.sortColumn];
      let valueB = b[this.sortColumn];

      if (this.sortColumn === 'likers') {
        valueA = a.likers.length;
        valueB = b.likers.length;
      }

      if (valueA instanceof Date && valueB instanceof Date) {
        valueA = valueA.getTime();
        valueB = valueB.getTime();
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) return this.sortDirection === 1 ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 1 ? 1 : -1;
      return 0;
    });
  }
}
