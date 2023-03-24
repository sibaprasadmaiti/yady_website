import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryBookingsComponent } from './query-bookings.component';

describe('QueryBookingsComponent', () => {
  let component: QueryBookingsComponent;
  let fixture: ComponentFixture<QueryBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
