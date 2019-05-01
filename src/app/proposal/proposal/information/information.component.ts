import { Component, OnInit, Input } from '@angular/core';
import { ScatterService } from '../../../services/scatter.service';
import { EosService } from '../../../services/eos.service';
import { ProposalComponent } from '../proposal.component';


@Component({
  selector: 'app-proposal-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {

  @Input() proposal;
  @Input() votes;

  public alive = false;

  constructor(
    private scatterService: ScatterService,
    private eosService: EosService,
  ) { }

  ngOnInit() {
    this.scatterService.load();
    this.alive = this.getProposalStage(this.proposal) !== 2 ? true : false;
    this.checkVoted();
  }

  isLogged() {
    return this.scatterService.isLoggedIn();
  }
  
  // 暂时还未调用
  login() {
    this.alive = true;
    this.scatterService.login();
    this.checkVoted(true);
  }

  accountName() {
    return this.scatterService.accountName();
  }
  // 检查当前账号是否能够投票
  checkIsGn() {

  }

  // 检查当前账号是否有过投票。login()调用时还未生效：this.votes 在login()之前加载进来，所以this.votes为空。
  checkVoted(flag=false) {
    if(this.isLogged() || flag) {
      console.log(this.votes);
      if(this.votes.length > 0 && this.votes[0].owner === this.accountName()) {
        alert(this.accountName() + ', you have voted proposal #' + this.proposal.id
               + ' ' + (this.votes.vote === 1 ? 'yea' : 'nay'));
      }
    }
  }

  vote(id, yea) {
    this.alive = true;
    const params = [id, yea];
    this.scatterService.takeAction("gocio", "gocvote", params);
  }

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
    return stage;
  }

}
