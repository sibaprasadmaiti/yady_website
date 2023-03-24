import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpQueryBookingDetailsComponent } from './sp-query-booking-details.component';

describe('SpQueryBookingDetailsComponent', () => {
  let component: SpQueryBookingDetailsComponent;
  let fixture: ComponentFixture<SpQueryBookingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpQueryBookingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpQueryBookingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
