import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryReplyDetailsComponent } from './query-reply-details.component';

describe('QueryReplyDetailsComponent', () => {
  let component: QueryReplyDetailsComponent;
  let fixture: ComponentFixture<QueryReplyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryReplyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryReplyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
