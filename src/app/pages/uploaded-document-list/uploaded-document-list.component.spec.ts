import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedDocumentListComponent } from './uploaded-document-list.component';

describe('UploadedDocumentListComponent', () => {
  let component: UploadedDocumentListComponent;
  let fixture: ComponentFixture<UploadedDocumentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadedDocumentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadedDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
