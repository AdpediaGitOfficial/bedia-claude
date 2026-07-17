import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflinepaymentAddComponent } from './offlinepayment-add.component';

describe('OfflinepaymentAddComponent', () => {
  let component: OfflinepaymentAddComponent;
  let fixture: ComponentFixture<OfflinepaymentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflinepaymentAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfflinepaymentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
