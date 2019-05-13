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
      label: 'RAM (GOC/KB)',
      fill: false,
      lineTension: 0.1,
      backgroundColor: '#1890ff',
      borderColor: '#1890ff',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: '#1890ff',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: '#1890ff',
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

  
  public _24h_nums: number = 144;
  public _7d_nums: number = 1008;
  public _30d_nums: number = 4320;
  public _24h_kind: number = 1;
  public _7d_kind: number = 2;
  public _30d_kind: number = 3;
  public defaultkind: number = this._24h_kind;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getRamPrice(this._24h_nums).subscribe(
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

  getColor(kind: number) {
    if(kind === this.defaultkind) {
      return "primary";
    }
    return "";
  }

  getDate(nums: number) {
    if(nums === this._24h_nums) {
      this.defaultkind = this._24h_kind;
    }else if(nums === this._7d_nums) {
      this.defaultkind = this._7d_kind;
    }else {
      this.defaultkind = this._30d_kind;
    }
    console.log(nums);
    this.getRamPrice(nums).subscribe(
      ramprices => {
        this.lineChartLabels = [];
        this.lineChartData[0].data = [];
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
  
  getRamPrice(size: number): Observable<any[]> {
    return this.http.get<any[]>('http://192.168.1.103:7000/armprice?size=' + size);
  }

  // events
  chartClicked(e: any): void {
    console.log('click', e);
  }

  chartHovered(e: any): void {
    console.log('hover', e);
  }
}
