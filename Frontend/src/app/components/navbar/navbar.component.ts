import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {

  @Input("sideBarSubject") sideBarSubject ?: Subject<void>;

  constructor() { }

  ngOnInit(): void {
  }

  toggleSideBar(){
    this.sideBarSubject?.next();
  }

}
