import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyQueryDetailsComponent } from './my-query-details.component';

describe('MyQueryDetailsComponent', () => {
  let component: MyQueryDetailsComponent;
  let fixture: ComponentFixture<MyQueryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyQueryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyQueryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
