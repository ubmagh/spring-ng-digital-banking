import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input('sideBarObservable') sideBarObservable?: Observable<void>;
  subscription?: Subscription;
  sidebarToggle: any = null;

  constructor() {}

  ngOnInit(): void {
    this.sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (this.sidebarToggle) {
      if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        document.body.classList.toggle('sb-sidenav-toggled');
      }
    }
    this.subscription = this.sideBarObservable?.subscribe((e) => {
      console.log("Here ");
      document.body.classList.toggle('sb-sidenav-toggled');
      localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled')+"" );
    });

  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
