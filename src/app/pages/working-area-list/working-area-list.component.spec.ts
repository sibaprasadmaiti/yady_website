import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingAreaListComponent } from './working-area-list.component';

describe('WorkingAreaListComponent', () => {
  let component: WorkingAreaListComponent;
  let fixture: ComponentFixture<WorkingAreaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkingAreaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingAreaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
