import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpBookingListComponent } from './sp-booking-list.component';

describe('SpBookingListComponent', () => {
  let component: SpBookingListComponent;
  let fixture: ComponentFixture<SpBookingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpBookingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpBookingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
