import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsViewComponent } from './reports-view.component';

describe('ReportsViewComponent', () => {
  let component: ReportsViewComponent;
  let fixture: ComponentFixture<ReportsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
