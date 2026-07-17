import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflinepaymentListComponent } from './offlinepayment-list.component';

describe('OfflinepaymentListComponent', () => {
  let component: OfflinepaymentListComponent;
  let fixture: ComponentFixture<OfflinepaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflinepaymentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfflinepaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
