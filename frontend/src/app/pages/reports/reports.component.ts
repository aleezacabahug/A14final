import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    this.createPieChart();
  }

  private createPieChart(): void {
    const data = [
      { category: 'Business Programs', value: 49 },
      { category: 'Nursing Programs', value: 68 },
      { category: 'Education Programs', value: 21 },
      { category: 'Public Affairs', value: 49 },
      { category: 'Psychology Programs', value: 78 }
    ];

    const width = 600;
    const height = 400;
    const margin = 50;

    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.category))
      .range(d3.schemeCategory10);

    const pie = d3.pie<any>()
      .value(d => d.value);

    const data_ready = pie(data);

    const arc = d3.arc<any>()
      .innerRadius(0)
      .outerRadius(radius);

    svg.selectAll('slices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.category) as string)
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    svg.selectAll('labels')
      .data(data_ready)
      .enter()
      .append('text')
      .text(d => d.data.category)
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', '12px');
  }
}
