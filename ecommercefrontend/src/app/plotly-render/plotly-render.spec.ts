import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotlyRender } from './plotly-render';

describe('PlotlyRender', () => {
  let component: PlotlyRender;
  let fixture: ComponentFixture<PlotlyRender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlotlyRender],
    }).compileComponents();

    fixture = TestBed.createComponent(PlotlyRender);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
