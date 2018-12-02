import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, share, catchError } from 'rxjs/operators';
import { EosService } from '../../services/eos.service';
//import { AppService } from '../../services/app.service';

@Component({
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss']
})
export class ProposalComponent implements OnInit {

  id$: Observable<number>;
  name$: Observable<number>;
  proposal$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private eosService: EosService,
    //private appService: AppService
  ) { }

  ngOnInit() {
    this.name$ = this.route.params.pipe(
      map(params => params.id)
    );
    this.proposal$ = combineLatest(
      this.name$,
      this.eosService.getProposals(),
      this.name$.pipe(
        switchMap(name => this.eosService.getProposal(name))
      )
    ).pipe(
      map(([name, proposals, account]) => {
        const proposal = proposals.find(proposal => proposal.id == name); //TODO ===
        let url = proposal.url;
        let owner = proposal.owner;
        let proposal_name = proposal.proposal_name;
        let proposal_content = proposal.proposal_content;
        let create_time = proposal.create_time;
        let vote_starttime = proposal.vote_starttime;
        let bp_vote_starttime = proposal.bp_vote_starttime;
        let bp_vote_endtime = proposal.bp_vote_endtime;
        let total_voter = proposal.total_voter;
        let total_bp = proposal.total_bp;
        return {
          ...proposal,
          account: account,
          id: name,
          url: url,
          owner: owner,
          proposal_name: proposal_name,
          proposal_content: proposal_content,
          create_time: create_time,
          vote_starttime: vote_starttime,
          bp_vote_starttime: bp_vote_starttime,
          ibp_vote_endtimed: bp_vote_endtime,
          total_voter: total_voter,
          total_bp: total_bp
        }
      }),
/*       switchMap(proposal => {
        if (!proposal.url) {
          return of(proposal);
        } else {
          return this.appService.getBpJson(proposal.url).pipe(
            catchError(() => of(null)),
            map(bpJson => ({
              ...proposal,
              bpJson,
              location: bpJson && bpJson.nodes && bpJson.nodes[0] && bpJson.nodes[0].location,
              validated: bpJson && bpJson.proposal_public_key === proposal.proposal_key && bpJson.proposal_account_id === proposal.owner
            }))
          );
        }
      }), */
      share()
    );
  }

}
