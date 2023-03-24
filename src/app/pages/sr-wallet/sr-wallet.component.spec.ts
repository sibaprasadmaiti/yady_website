import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrWalletComponent } from './sr-wallet.component';

describe('SrWalletComponent', () => {
  let component: SrWalletComponent;
  let fixture: ComponentFixture<SrWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
