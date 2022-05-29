import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { User } from './models/user.model';
import { SecurityService } from './services/security.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, OnDestroy {

  sideBarSubject : Subject<void> = new Subject<void>()
  securitySub$ ?: Subscription;
  user ?: User;

  constructor( private securityService:SecurityService){
    this.securitySub$ = securityService.userSubject.subscribe({
      next: user=>{
        this.user = user;
      },
      error: err=>{
        this.user = undefined;
        console.error("AppComponent: securitySub$: ",err.message)
      }
    })
  }

  ngOnInit(): void {
    this.securityService.getUser();
  }

  ngOnDestroy(): void {
    this.securitySub$?.unsubscribe();
  }


}

