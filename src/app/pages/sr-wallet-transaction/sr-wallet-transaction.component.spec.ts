import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrWalletTransactionComponent } from './sr-wallet-transaction.component';

describe('SrWalletTransactionComponent', () => {
  let component: SrWalletTransactionComponent;
  let fixture: ComponentFixture<SrWalletTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrWalletTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrWalletTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
