import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit, OnDestroy {

  securityservSub$ ?: Subscription;
  authenticated = false;

  constructor( private titleService :Title, private securityService:SecurityService ) { 
    titleService.setTitle("Ebank- Home");
    this.authenticated = this.securityService.user !=undefined;
    
    this.securityservSub$ = this.securityService.userSubject.subscribe({
      next: user=>{
        this.authenticated = user!=undefined;
      },
      error: err=>{
        this.authenticated = false;
      }
    });
  }

  ngOnInit(): void {
    this.securityservSub$ = this.securityService.userSubject.subscribe({
      next: user=>{
        this.authenticated = user!=undefined;
      },
      error: err=>{
        this.authenticated = false;
      }
    });
  }


  ngOnDestroy(): void {
    this.securityservSub$?.unsubscribe();
  }


}
