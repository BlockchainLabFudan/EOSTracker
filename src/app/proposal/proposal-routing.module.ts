import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProposalsComponent } from './proposals/proposals.component';
import { ProposalComponent } from './proposal/proposal.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ProposalsComponent
  },
  {
    path: ':id',
    component: ProposalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProposalRoutingModule { }
