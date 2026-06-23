import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeLayout } from './employe-layout';

describe('EmployeLayout', () => {
  let component: EmployeLayout;
  let fixture: ComponentFixture<EmployeLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
