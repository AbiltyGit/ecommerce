import { Component, Input, AfterViewInit, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component({
  selector: 'app-plotly-render',
  standalone: true,
  template: `<div #plotContainer [id]="plotId" class="w-full h-80 rounded-xl overflow-hidden glass-card my-4"></div>`
})
export class PlotlyRender implements AfterViewInit, OnChanges {
  @Input() code!: string;
  @ViewChild('plotContainer') plotContainer!: ElementRef;
  
  plotId = 'plot_div_' + Math.random().toString(36).substring(2, 9);
  private viewInitialized = false;

  ngAfterViewInit() {
    this.viewInitialized = true;
    this.renderPlot();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['code'] && this.viewInitialized) {
      this.renderPlot();
    }
  }

  private renderPlot() {
    if (!this.code || this.code.trim() === '') return;

    try {
      let executableCode = this.code.trim();

      // Strip markdown code fences if the AI wrapped the output
      executableCode = executableCode
        .replace(/^```[\w]*\n?/m, '')
        .replace(/\n?```$/m, '')
        .trim();

      // Strategy 1: Try to parse as raw Plotly JSON {data: [...], layout: {...}}
      if (executableCode.startsWith('{') || executableCode.startsWith('[')) {
        try {
          const spec = JSON.parse(executableCode);
          const data = spec.data || (Array.isArray(spec) ? spec : [spec]);
          const layout = {
            paper_bgcolor: '#1a1a2e',
            plot_bgcolor: '#1a1a2e',
            font: { color: '#e2e8f0' },
            ...(spec.layout || {})
          };
          (Plotly as any).newPlot(this.plotContainer.nativeElement, data, layout);
          return;
        } catch {
          // Not valid JSON, fall through to JS eval
        }
      }

      // Strategy 2: Execute as JavaScript, replacing the div target with our dynamic element
      // Replace 'plot_div' string literal with our actual element reference
      executableCode = executableCode.replace(
        /Plotly\.newPlot\s*\(\s*['"]plot_div['"]/g,
        `Plotly.newPlot(plotEl`
      );

      (window as any).Plotly = Plotly;
      const renderFn = new Function('Plotly', 'plotEl', executableCode);
      renderFn(Plotly, this.plotContainer.nativeElement);

    } catch (e) {
      console.error('Failed to render Plotly chart:', e);
      console.error('Code that failed:', this.code);
      if (this.plotContainer?.nativeElement) {
        this.plotContainer.nativeElement.innerHTML =
          `<div style="color:#f87171;padding:16px;font-size:13px;font-family:monospace;">
            ⚠️ Visualization render failed.<br><br>
            <strong>Error:</strong> ${(e as Error).message}
          </div>`;
      }
    }
  }
}
