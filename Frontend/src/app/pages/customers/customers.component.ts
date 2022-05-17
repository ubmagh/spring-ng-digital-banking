import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.sass']
})
export class CustomersComponent implements OnInit {

  constructor( private titleService :Title) { 
    titleService.setTitle("Ebank- Customers");
  }

  ngOnInit(): void {
  }

}
