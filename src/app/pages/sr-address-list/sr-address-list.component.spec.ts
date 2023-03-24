import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrAddressListComponent } from './sr-address-list.component';

describe('SrAddressListComponent', () => {
  let component: SrAddressListComponent;
  let fixture: ComponentFixture<SrAddressListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrAddressListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrAddressListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
