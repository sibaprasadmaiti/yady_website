import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyQueryListComponent } from './my-query-list.component';

describe('MyQueryListComponent', () => {
  let component: MyQueryListComponent;
  let fixture: ComponentFixture<MyQueryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyQueryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyQueryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
