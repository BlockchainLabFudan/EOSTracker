import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { EosService } from '../../services/eos.service';
import { Observable, of, timer } from 'rxjs';
import { map, share, switchMap, tap } from 'rxjs/operators';

@Component({
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.scss']
})
export class ProposalsComponent implements OnInit {

  columnHeaders$: Observable<string[]> = of(PROPOSALS_COLUMNS);
  proposals$: Observable<any[]>;
  chainStatus$: Observable<any>;
  pageIndex = 0;
  pageSize = 20;
  total = 0;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private eosService: EosService
  ) { }

  ngOnInit() {
    this.columnHeaders$ = this.breakpointObserver.observe(Breakpoints.XSmall).pipe(
      map(result => result.matches ? PROPOSALS_COLUMNS.filter((c: any) => (c !== 'url' && c !== 'numVotes')) : PROPOSALS_COLUMNS)
    );
    this.proposals$ = this.eosService.newgetProposals(this.pageIndex, this.pageSize).pipe(
      tap(proposals => {
        this.total = proposals[0]['rows'][0].id;
      })
    );
  }

  onPaging(pageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.proposals$ = this.eosService.newgetProposals(pageEvent.length - pageEvent.pageSize * pageEvent.pageIndex, pageEvent.pageSize);
  }
/*
  ngOnInitbak() {
    this.columnHeaders$ = this.breakpointObserver.observe(Breakpoints.XSmall).pipe(
      map(result => result.matches ? PROPOSALS_COLUMNS.filter((c: any) => (c !== 'url' && c !== 'numVotes')) : PROPOSALS_COLUMNS)
    );
    this.chainStatus$ = timer(0, 60000).pipe(
      switchMap(() => this.eosService.getChainStatus()),
      share()
    );
    this.proposals$ = this.chainStatus$.pipe(
      switchMap(chainStatus => this.eosService.getProposals().pipe(
        map(proposals => {
          return proposals.map((proposal, index) => {
            let tindex = index;
            let tid = proposal.id;
            let towner = proposal.owner;
            let turl = proposal.url;
            let tproposal_name = proposal.proposal_name;
            let tproposal_content = proposal.proposal_content;
            let tfee = proposal.fee;

            return {
              ...proposal,
              index: tindex,
              id: tid,
              owner: towner,
              url: turl,
              proposal_name: tproposal_name,
              proposal_content: tproposal_content,
              fee: tfee
            }
          });
        })
      )),
      share()
    );
  }
*/


}

export const PROPOSALS_COLUMNS = [
  'id',
  'owner',
  'url',
  'proposal_name',
  'proposal_content',
  'fee'
];