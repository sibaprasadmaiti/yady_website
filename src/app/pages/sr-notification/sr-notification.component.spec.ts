import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrNotificationComponent } from './sr-notification.component';

describe('SrNotificationComponent', () => {
  let component: SrNotificationComponent;
  let fixture: ComponentFixture<SrNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
