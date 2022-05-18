import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.sass']
})
export class AccountsComponent implements OnInit {

  selectedCustomerId : Subject<string> = new Subject<string>()

  constructor( private titleService :Title) { 
    titleService.setTitle("Ebank- Accounts");
  }


  ngOnInit(): void {
  }

}
