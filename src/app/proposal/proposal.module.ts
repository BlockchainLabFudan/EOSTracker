import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProposalRoutingModule } from './proposal-routing.module';
import { AgmCoreModule } from '@agm/core';

import { ProposalsComponent } from './proposals/proposals.component';
import { ProposalComponent } from './proposal/proposal.component';
import { VoteProgressBarComponent } from './vote-progress-bar/vote-progress-bar.component';
import { InformationComponent } from './proposal/information/information.component';
import { NodesComponent } from './proposal/nodes/nodes.component';

@NgModule({
  imports: [
    SharedModule,
    ProposalRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAm8XqMj1dCSiEDlfb4c5KlZ9kbcBmTLS0'
    })
  ],
  declarations: [
    ProposalsComponent,
    ProposalComponent,
    VoteProgressBarComponent,
    InformationComponent,
    NodesComponent
  ]
})
export class ProposalModule { }
