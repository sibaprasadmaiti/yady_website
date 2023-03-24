import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSubCategoryComponent } from './service-sub-category.component';

describe('ServiceSubCategoryComponent', () => {
  let component: ServiceSubCategoryComponent;
  let fixture: ComponentFixture<ServiceSubCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceSubCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
