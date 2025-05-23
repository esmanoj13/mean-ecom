import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormcategoryComponent } from './formcategory.component';

describe('FormcategoryComponent', () => {
  let component: FormcategoryComponent;
  let fixture: ComponentFixture<FormcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormcategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
