import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.sass']
})
export class AccountsComponent implements OnInit {

  constructor( private titleService :Title) { 
    titleService.setTitle("Ebank- Accounts");
  }


  ngOnInit(): void {
  }

}
