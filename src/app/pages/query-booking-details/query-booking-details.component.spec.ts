import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryBookingDetailsComponent } from './query-booking-details.component';

describe('QueryBookingDetailsComponent', () => {
  let component: QueryBookingDetailsComponent;
  let fixture: ComponentFixture<QueryBookingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryBookingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryBookingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
