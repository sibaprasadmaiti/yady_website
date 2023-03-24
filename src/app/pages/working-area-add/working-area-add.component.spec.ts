import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingAreaAddComponent } from './working-area-add.component';

describe('WorkingAreaAddComponent', () => {
  let component: WorkingAreaAddComponent;
  let fixture: ComponentFixture<WorkingAreaAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkingAreaAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingAreaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
