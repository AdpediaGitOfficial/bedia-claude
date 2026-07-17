import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflinepaymentDetailComponent } from './offlinepayment-detail.component';

describe('OfflinepaymentDetailComponent', () => {
  let component: OfflinepaymentDetailComponent;
  let fixture: ComponentFixture<OfflinepaymentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflinepaymentDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfflinepaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
