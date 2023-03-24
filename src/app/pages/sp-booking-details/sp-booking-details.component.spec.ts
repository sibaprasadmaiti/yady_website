import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpBookingDetailsComponent } from './sp-booking-details.component';

describe('SpBookingDetailsComponent', () => {
  let component: SpBookingDetailsComponent;
  let fixture: ComponentFixture<SpBookingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpBookingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpBookingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
