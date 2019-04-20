import {Injectable} from '@angular/core';
import * as Eos from 'eosjs';
import {LocalStorage} from 'ngx-webstorage';

@Injectable()
export class ScatterService {
  @LocalStorage()
  identity: any;
  eos: any;
  scatter: any;
  network: any;

  load() {
    this.scatter = (<any>window).scatter;

    this.network = {
      blockchain: 'goc',
      host: 'api.goclab.io',
      port: 8080,
      chainId: '4abcef3ea73a7cd42b2e39e247355048b684225d21d68aa303dd22712e8ca05d'
    };
    if (this.scatter) {
      this.eos = this.scatter.eos(this.network, Eos, {chainId: this.network.chainId}, 'http');
    }

  }

  login() {
    this.load();
    const requirements = {accounts: [this.network]};
    if (!this.scatter) {
      alert("You need to install Scatter to use the form.");
      return;
    }
    return this.scatter.getIdentity(requirements);
  }

  logout() {
    this.scatter.forgetIdentity();
  }

  isLoggedIn() {
    return this.scatter && !!this.scatter.identity;
  }

  accountName() {
    if (!this.scatter || !this.scatter.identity) {
      return;
    }
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === 'goc');
    return account.name;
  }

  support(amount: string) {
    this.load();
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === 'goc');
    return this.eos.transfer(account.name, 'zmaozmaozmao', amount + " GOC", 'Aegis Support');
  }

  refund() {
    this.load();
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === 'goc');
    const options = {authorization: [`${account.name}@${account.authority}`]};
    return this.eos.contract('zmaozmaozmao').then(contract => contract.refund(account.name, options));
  }

  takeAction(code: string, action: string, params) {
    this.login().then(() => {
      const account = this.scatter.identity.accounts.find(acc => acc.blockchain === 'goc');
      const transactionOptions = { authorization:[`${account.name}@${account.authority}`] };

      this.eos.contract(code).then(ins => {
          return ins[action](account.name, ...params, transactionOptions)
        }).then(res => {
          // console.log(res);
        }).catch(error => {
          console.error(error);
        })

    }).catch(error => {
      console.error("takeAction error: ",error)
    });
    
  }
}
