import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isScrolled: boolean = false;
  showSearch: boolean = false;
  searchQuery: string = '';
  isMobileScreen: boolean = false;
  navbarDisplay = true;
  lastScrollTop = 0;
  

  constructor(private router: Router) {
    this.checkScreenSize();
  }

  @ViewChild('searchInput')
  searchInputElement!: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (
      this.showSearch &&
      !this.searchInputElement.nativeElement.contains(event.target) &&
      this.searchQuery.length == 0
    ) {
      this.showSearch = false;
      console.log('ici');
    }
  }

  onSearchChange(): void {
    if (this.searchQuery.length > 0) {
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
    if(window.scrollY > 100){
      this.isScrolled =true;
    }else{
      this.isScrolled =false;
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

  // @HostListener('window:scroll', [])
  // onScroll(): void {
  //   let currentScrollTop = window.scrollY;
  //   if(window.scrollY > 100){
  //     this.isScrolled =true;
  //   }
  //   if (currentScrollTop > this.lastScrollTop && this.navbarDisplay==true ) {
  //     // Scroll vers le bas
  //     this.navbarDisplay = false;
  //   }
  //   if(currentScrollTop < this.lastScrollTop && this.navbarDisplay==false){
  //     // Scroll vers le haut
  //     this.navbarDisplay = true;
  //   }
  //   console.log(this.navbarDisplay)
  //   this.lastScrollTop = currentScrollTop;
  // }

  toggleSearch(event: Event): void {
    event.stopPropagation(); // Empêche l'événement de se propager au document
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      setTimeout(() => this.searchInputElement.nativeElement.focus(), 0);
    } else {
      this.closeSearch();
    }
  }

  closeSearch(): void {
    this.showSearch = false;
    this.searchQuery = '';
    this.router.navigate(['/']);
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
