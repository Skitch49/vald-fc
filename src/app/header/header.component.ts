import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleApiService, UserInfo } from '../services/google-api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isScrolled: boolean = false;
  showSearch: boolean = false;
  showLogout: boolean = false;
  searchQuery: string = '';
  isMobileScreen: boolean = false;
  navbarDisplay = true;
  lastScrollTop = 0;
  userInfo?: UserInfo;

  constructor(
    private router: Router,
    private readonly google: GoogleApiService
  ) {
    this.checkScreenSize();
    google.userProfileSubject.subscribe((info) => {
      this.userInfo = info;
      console.log('info : ' + JSON.stringify(info));
    });
  }

  login() {
    this.google.signIn();
  }

  isLoggedIn(): boolean {
    return this.google.isLoggedIn();
  }

  logout() {
    this.google.signOut();
  }

  @ViewChild('searchInput')
  searchInputElement!: ElementRef;
  @ViewChild('logoutViewChild')
  logoutElement!: ElementRef;
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (
      this.showSearch &&
      !this.searchInputElement.nativeElement.contains(event.target) &&
      !this.searchQuery
    ) {
      this.showSearch = false;
    }
    if (
      this.showLogout &&
      !this.logoutElement.nativeElement.contains(event.target)
    ) {
      this.showLogout = false;
    }
  }

  onSearchChange(): void {
    if (this.searchQuery) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchQuery },
      });
    } else {
      this.router.navigate(['/']); // Naviguer vers l'accueil si la requête est vide
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const currentScrollTop = window.scrollY;

    // Seuil pour éviter les changements trop fréquents
    const scrollThreshold = 50;
    if (window.scrollY > 100) {
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }
    // Vérifie si l'utilisateur a défilé d'un certain seuil
    if (Math.abs(currentScrollTop - this.lastScrollTop) > scrollThreshold) {
      if (currentScrollTop > this.lastScrollTop && window.scrollY > 100) {
        // L'utilisateur fait défiler vers le bas
        this.navbarDisplay = false;
      } else {
        // L'utilisateur fait défiler vers le haut
        this.navbarDisplay = true;
      }
      console.log(this.navbarDisplay);
      this.lastScrollTop = currentScrollTop; // Mettre à jour le dernier scroll top
    }
  }

  toggleSearch(event: Event): void {
    event.stopPropagation(); // Empêche l'événement de se propager au document
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      this.showLogout = false;
      setTimeout(() => this.searchInputElement.nativeElement.focus(), 0);
    } else {
      if (this.searchQuery == '') {
        this.closeSearch();
      } else {
        this.closeSearch();
        this.router.navigate(['/']);
      }
    }
  }

  toggleLogout(event: Event): void {
    event.stopPropagation(); // Empêche l'événement de se propager au document
    this.showLogout = !this.showLogout;
    if (this.showLogout) {
      this.closeSearch();
    }
  }

  closeSearch(): void {
    this.showSearch = false;
    this.searchQuery = '';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 768) {
        this.isMobileScreen = true;
      } else {
        this.isMobileScreen = false;
      }
    }
  }
}
