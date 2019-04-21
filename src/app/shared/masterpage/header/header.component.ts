import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ScatterService } from '../../../services/scatter.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() onMenuToggle = new EventEmitter();

  logoUrl = environment.logoUrl;
  appName = environment.appName;
  searchExpanded = false;

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

  logout() {
    this.scatterService.logout();
  }

}
