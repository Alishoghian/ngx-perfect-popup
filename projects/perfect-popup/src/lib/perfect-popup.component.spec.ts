import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfectPopupComponent } from './perfect-popup.component';

describe('PerfectPopupComponent', () => {
  let component: PerfectPopupComponent;
  let fixture: ComponentFixture<PerfectPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfectPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfectPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
