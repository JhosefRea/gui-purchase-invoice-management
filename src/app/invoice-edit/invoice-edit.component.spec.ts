import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceEditComponent } from './invoice-edit.component';

describe('InvoiceEditComponent', () => {
  let component: InvoiceEditComponent;
  let fixture: ComponentFixture<InvoiceEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
