import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpEarningListComponent } from './sp-earning-list.component';

describe('SpEarningListComponent', () => {
  let component: SpEarningListComponent;
  let fixture: ComponentFixture<SpEarningListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpEarningListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpEarningListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
