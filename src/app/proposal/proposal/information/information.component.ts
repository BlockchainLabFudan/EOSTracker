import { Component, OnInit, Input } from '@angular/core';
import { ScatterService } from '../../../services/scatter.service';

@Component({
  selector: 'app-proposal-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {

  @Input() proposal;

  public alive = false;

  constructor(
    private scatterService: ScatterService,
  ) { }

  ngOnInit() {
    this.scatterService.load();
  }

  isLogged() {
    return this.scatterService.isLoggedIn();
  }

  login() {
    this.scatterService.login();
  }

  vote(id, yea) {
    this.alive = true;
    const params = [id, yea];
    this.scatterService.takeAction("gocio", "gocvote", params);
  }

}
