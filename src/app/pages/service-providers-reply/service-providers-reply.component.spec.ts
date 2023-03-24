import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProvidersReplyComponent } from './service-providers-reply.component';

describe('ServiceProvidersReplyComponent', () => {
  let component: ServiceProvidersReplyComponent;
  let fixture: ComponentFixture<ServiceProvidersReplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceProvidersReplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceProvidersReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
