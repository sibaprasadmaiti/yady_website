import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryServiceDetailsComponent } from './query-service-details.component';

describe('QueryServiceDetailsComponent', () => {
  let component: QueryServiceDetailsComponent;
  let fixture: ComponentFixture<QueryServiceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryServiceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryServiceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
