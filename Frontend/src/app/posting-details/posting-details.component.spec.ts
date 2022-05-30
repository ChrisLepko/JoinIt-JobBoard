import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostingDetailsComponent } from './posting-details.component';

describe('PostingDetailsComponent', () => {
  let component: PostingDetailsComponent;
  let fixture: ComponentFixture<PostingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
