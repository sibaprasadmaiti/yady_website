import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrAddressAddComponent } from './sr-address-add.component';

describe('SrAddressAddComponent', () => {
  let component: SrAddressAddComponent;
  let fixture: ComponentFixture<SrAddressAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrAddressAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrAddressAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
