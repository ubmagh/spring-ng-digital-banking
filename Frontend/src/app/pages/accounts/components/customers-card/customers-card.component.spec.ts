import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersCardComponent } from './customers-card.component';

describe('CustomersCardComponent', () => {
  let component: CustomersCardComponent;
  let fixture: ComponentFixture<CustomersCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomersCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
