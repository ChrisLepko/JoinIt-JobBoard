import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPostingsComponent } from './job-postings.component';

describe('JobPostingsComponent', () => {
  let component: JobPostingsComponent;
  let fixture: ComponentFixture<JobPostingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobPostingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobPostingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
