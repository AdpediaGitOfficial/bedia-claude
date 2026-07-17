import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlinepaymentListComponent } from './onlinepayment-list.component';

describe('OnlinepaymentListComponent', () => {
  let component: OnlinepaymentListComponent;
  let fixture: ComponentFixture<OnlinepaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlinepaymentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlinepaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
