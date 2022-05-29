import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { SecurityService } from 'src/app/services/security.service';

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

  isAdmin = false;
  securityServicSub$ ?: Subscription;

  constructor( private securityService:SecurityService) {
    this.securityServicSub$ = this.securityService.userSubject.subscribe({
      next: user=>{
        this.isAdmin = user?.roles.find(e=>e.roleName=="ADMIN")!=undefined;
      }, 
      error: err=>{
        this.isAdmin = false;
      }
    })
  }

  ngOnInit(): void {

    this.isAdmin = this.securityService.user?.roles.find(e=>e.roleName=="ADMIN")!=undefined;

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
    this.securityServicSub$?.unsubscribe();
  }
}
