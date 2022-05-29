import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { SecurityService } from 'src/app/services/security.service';
var bootstrap:any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input("sideBarSubject") sideBarSubject ?: Subject<void>;
  user ?: User;
  userRole ="";
  userSub$ ?:Subscription;

  constructor( private securityService:SecurityService, private router:Router, private toastr: ToastrService) {
    this.userSub$ = this.securityService.userSubject.subscribe({
      next: user=>{
        this.user = user;
        this.userRole = user?.roles.find(e=>e.roleName=="ADMIN")!=undefined?"ADMIN":"USER";
      },
      error: err=>{

      }
    })
   }

  ngOnInit(): void {
      this.user = this.securityService.user;
      this.userRole = this.securityService.user?.roles.find(e=>e.roleName=="ADMIN")!=undefined?"ADMIN":"USER";
  }

  ngAfterViewInit(): void {
    document.addEventListener('load', function(){
      const tooltipTriggerList:any = document.querySelectorAll('[data-bs-toggle="tooltip"]')
      const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    })
  }

  toggleSideBar(){
    this.sideBarSubject?.next();
  }

  logout(){
    this.securityService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.userSub$?.unsubscribe(); 
  }

  qliq(){
    this.toastr.info( "You can't yet register ...", "register not yet available")
  }

}
