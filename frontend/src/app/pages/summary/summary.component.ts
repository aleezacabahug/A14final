import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    this.createChart();
  }

  private createChart(): void {
    const data = [
      { category: 'Charlotte MBA', value: 49 },
      { category: 'Nursing Master’s', value: 68 },
      { category: 'Nurse Anesthesia', value: 33 },
      { category: 'Doctor of Nursing Practice', value: 85 },
      { category: 'Special Education', value: 21 },
      { category: 'Public Affairs', value: 49 },
      { category: 'Clinical Psychology', value: 78 }
    ];

    const svg = d3.select('svg');
    const margin = 50;
    const width = +svg.attr('width') - margin * 2;
    const height = +svg.attr('height') - margin * 2;

    const chart = svg.append('g')
      .attr('transform', `translate(${margin}, ${margin})`);

    const xScale = d3.scaleBand()
      .range([0, width])
      .domain(data.map(d => d.category))
      .padding(0.4);

    const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, d => d.value) ?? 0]);

    chart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    chart.append('g')
      .call(d3.axisLeft(yScale));

    chart.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.category) ?? 0)
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d.value))
      .attr('fill', '#4CAF50');
  }
}
