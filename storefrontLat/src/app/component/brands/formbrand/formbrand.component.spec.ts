import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormbrandComponent } from './formbrand.component';

describe('FormbrandComponent', () => {
  let component: FormbrandComponent;
  let fixture: ComponentFixture<FormbrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormbrandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormbrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
