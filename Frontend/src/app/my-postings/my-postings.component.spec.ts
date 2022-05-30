import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPostingsComponent } from './my-postings.component';

describe('MyPostingsComponent', () => {
  let component: MyPostingsComponent;
  let fixture: ComponentFixture<MyPostingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPostingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPostingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
