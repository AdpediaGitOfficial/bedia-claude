import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlinepaymentDetailComponent } from './onlinepayment-detail.component';

describe('OnlinepaymentDetailComponent', () => {
  let component: OnlinepaymentDetailComponent;
  let fixture: ComponentFixture<OnlinepaymentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlinepaymentDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlinepaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
