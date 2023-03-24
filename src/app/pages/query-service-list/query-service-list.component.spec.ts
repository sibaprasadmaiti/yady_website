import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryServiceListComponent } from './query-service-list.component';

describe('QueryServiceListComponent', () => {
  let component: QueryServiceListComponent;
  let fixture: ComponentFixture<QueryServiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryServiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
