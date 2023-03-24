import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpQueryBookingListComponent } from './sp-query-booking-list.component';

describe('SpQueryBookingListComponent', () => {
  let component: SpQueryBookingListComponent;
  let fixture: ComponentFixture<SpQueryBookingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpQueryBookingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpQueryBookingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
