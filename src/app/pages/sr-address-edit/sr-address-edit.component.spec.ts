import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrAddressEditComponent } from './sr-address-edit.component';

describe('SrAddressEditComponent', () => {
  let component: SrAddressEditComponent;
  let fixture: ComponentFixture<SrAddressEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrAddressEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrAddressEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
