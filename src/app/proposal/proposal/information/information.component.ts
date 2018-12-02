import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-proposal-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {

  @Input() proposal;

  constructor() { }

  ngOnInit() {
  }

}
