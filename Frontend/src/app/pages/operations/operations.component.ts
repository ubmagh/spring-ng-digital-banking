import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.sass']
})
export class OperationsComponent implements OnInit {

  selectedCustomerId : Subject<string> = new Subject<string>()
  selectedAccountId : Subject<string> = new Subject<string>()

  constructor( private titleService :Title) { 
    titleService.setTitle("Ebank- operations");
  }

  ngOnInit(): void {
  }

}
