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
  pageIndex = -1;
  pageSize = 50;
  total = 0;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private eosService: EosService
  ) { }


  ngOnInit() {
    this.columnHeaders$ = this.breakpointObserver.observe(Breakpoints.XSmall).pipe(
      map(result => result.matches ? PROPOSALS_COLUMNS.filter((c: any) => (c !== 'url' && c !== 'numVotes')) : PROPOSALS_COLUMNS)
    );
    this.proposals$ = this.eosService.getProposals(this.pageIndex, this.pageSize).pipe(
      map(proposals => {
        this.total = proposals[0].id;
        return proposals.map((proposal, index) => {
          let tindex = index;
          let tid = proposal.id;
          let towner = proposal.owner;
          let turl = proposal.url;
          let tproposal_name = proposal.proposal_name;
          let tproposal_content = proposal.proposal_content;
          let tstatus = this.zh_status[this.getProposalStage(proposal)];
          let tcolor = this.color[this.getProposalStage(proposal)];

          return {
            ...proposal,
            index: tindex,
            id: tid,
            owner: towner,
            url: turl,
            proposal_name: tproposal_name,
            proposal_content: tproposal_content,
            status: tstatus,
            color: tcolor
          }
        });
      })
    );
  }

  zh_status: any[] = [
      '错误',
      '公示中',
      'gn投票中',
      'bp投票中',
      '已结束未结算',
      '已结算'
    ];
    color: any[] = [
      '#ff0000',
      '#0000ff',
      '#00aa00',
      '#aaaa00',
      '#af4747',
      '#ff4747'
    ];

  onPaging(pageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.proposals$ = this.eosService.getProposals(pageEvent.length - pageEvent.pageSize * pageEvent.pageIndex, pageEvent.pageSize).pipe(
      map(proposals => {
        return proposals.map((proposal, index) => {
          let tindex = index;
          let tid = proposal.id;
          let towner = proposal.owner;
          let turl = proposal.url;
          let tproposal_name = proposal.proposal_name;
          let tproposal_content = proposal.proposal_content;
          let tstatus = this.zh_status[this.getProposalStage(proposal)];
          let tcolor = this.color[this.getProposalStage(proposal)];

          return {
            ...proposal,
            index: tindex,
            id: tid,
            owner: towner,
            url: turl,
            proposal_name: tproposal_name,
            proposal_content: tproposal_content,
            status: tstatus,
            color: tcolor
          }
        });
      })
    );
  }


  /*
  stage        
  0           error     错误
  1           updating  公示中
  2           GN vote   gn投票中
  3           BP vote   bp投票中
  4           end       已结束未结算
  5                     已结算
*/
  getProposalStage(proposal) {
      let stage = 0;   // 0
      let dnow = Date.now();
      let bp_vote_endtime = new Date(proposal.bp_vote_endtime).getTime();
      let bp_vote_starttime = new Date(proposal.bp_vote_starttime).getTime();
      let vote_starttime = new Date(proposal.vote_starttime).getTime();
      let create_time = new Date(proposal.create_time).getTime();
      let reward = proposal.reward;
      if(dnow > bp_vote_endtime) {
        if(reward === '0.0000 GOC')
          stage = 4;   // 4
        else
          stage = 5    // 5
      } else if(dnow > bp_vote_starttime) {
        stage = 3;   // 3
      } else if(dnow > vote_starttime) {
        stage = 2;   // 2
      } else if(dnow > create_time) {
        stage = 1;   // 1
      }
      console.log(stage)
      return stage;
    }
  

}

export const PROPOSALS_COLUMNS = [
  'id',
  'owner',
  'url',
  'proposal_name',
  'proposal_content',
  'status'
];