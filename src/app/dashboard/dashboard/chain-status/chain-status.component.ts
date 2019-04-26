import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../services/app.service';
import { EosService } from '../../../services/eos.service';

import { ActivatedRoute } from '@angular/router';
import { Result } from '../../../models';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-chain-status',
  templateUrl: './chain-status.component.html',
  styleUrls: ['./chain-status.component.scss']
})
export class ChainStatusComponent implements OnInit {

  status$;
  account$;
  name$: Observable<string>;

  constructor(
    private appService: AppService,
    private eosService: EosService
  ) { }

  ngOnInit() {
    this.status$ = this.appService.info$;
    this.account$ = this.eosService.getAccountRaw('gocio.gstake').pipe(
      map(account => {
        let core_liquid_balance = account.value.core_liquid_balance;
        let arr = core_liquid_balance.split('.');
        return {
          ...account,
          quantity:parseInt(arr[0])/100000
        };
      })
    );
    
  }

}
