import { Component, OnInit, Input } from '@angular/core';

import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class PriceComponent implements OnInit {

  @Input() price: any;

  // lineChart
  lineChartData: Array<any> = [
    {
      label: 'RAM Price',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      // data: [2.0765, 2.0365, 2.2765, 2.0705, 2.0065, 2.0715, 2.1765],
      data: [],
    },
  ];
  // lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  lineChartLabels: Array<String> = [];
  lineChartOptions: any = {
    responsive: true,
    // scaleShowVerticalLines: false,
    scales: {
      xAxes: [
        {
          display:false
        }
      ]
    },
  };
  public lineChartLegend = true;
  public lineChartType = 'line';

  constructor(
    private http: HttpClient
  ) { }


  ngOnInit() {
    this.getRamPrice().subscribe(
      ramprices => {
        for(var i = ramprices.length-1; i >= 0; i--) {
          var timestamp = ramprices[i]["date"]["sec"];
          var newDate = new Date();
          newDate.setTime(timestamp*1000);
          
          this.lineChartLabels.push(newDate.toLocaleString());
          this.lineChartData[0].data.push(ramprices[i]["price"]);
        }
      }
    );

  }
  
  getRamPrice(): Observable<any[]> {
    return this.http.get<any[]>(`http://192.168.1.103:7000/armprice?size=144`);
  }

  // events
  chartClicked(e: any): void {
    console.log('click', e);
  }

  chartHovered(e: any): void {
    console.log('hover', e);
  }
}
