 
import React, { Component } from 'react'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import NavComp from './components/NavComp'
import Home from './components/Home'
import CreateTrend from './components/CreateTrend'
import View from './components/View'
import AddCharity from './components/AddCharity'

import Big from 'big.js'

const BOATLOAD_OF_GAS = Big(1).times(10 ** 16).toFixed()

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
          login: false,
          speech: null,
          userBalance: 0, 
          fundVal: 100
        }
        this.signedInFlow = this.signedInFlow.bind(this);
        this.requestSignIn = this.requestSignIn.bind(this);
        this.requestSignOut = this.requestSignOut.bind(this);
        this.signedOutFlow = this.signedOutFlow.bind(this);
      }
    
      componentWillMount() {
        let loggedIn = this.props.wallet.isSignedIn();
        if (loggedIn) {
          this.signedInFlow();
        } else {
          this.signedOutFlow();
        }
      }
    
      async signedInFlow() {
        console.log("come in sign in flow")
        this.setState({
          login: true,
        })
        const accountId = await this.props.wallet.getAccountId()
        if (window.location.search.includes("account_id")) {
          window.location.replace(window.location.origin + window.location.pathname)
        }
        let amt = await (this.props.wallet.account().state());
        // console.log(Big(amt.amount).div(10 ** 24).toFixed());
        this.setState({account_id: accountId, userBalance: Big(amt.amount).div(10 ** 24).toFixed(2)})
      }
    
      async requestSignIn() {
        const appTitle = 'Meme-Chain';
        await this.props.wallet.requestSignIn(
          this.props.nearConfig.contractName,
          appTitle
        )
      }
      
      async testTopic() {

      }

    
      requestSignOut() {
        this.props.wallet.signOut();
        setTimeout(this.signedOutFlow, 500);
        console.log("after sign out", this.props.wallet.isSignedIn())
      }
    
      signedOutFlow() {
        if (window.location.search.includes("account_id")) {
          window.location.replace(window.location.origin + window.location.pathname)
        }
        this.setState({
          account_id: null, 
          login: false,
          speech: null
        })
      }
      
    render() {
        return (
            <div>
              <NavComp 
                 acctID={this.state.account_id}
                 userBalance = {this.state.userBalance}
                 reqSignOut = {this.requestSignOut}
                 reqSignIn = {this.requestSignIn} 
                 wallet = {this.props.wallet}
              />
              <Router>
                <Switch>
                  <Route exact path="/" component={() => <Home 
                    contract = {this.props.contract}
                  />} />
                  <Route exact path="/createTrend" component={() => <CreateTrend 
                    contract = {this.props.contract}
                  />} />
                  <Route path="/view/:id" component={(props) => <View 
                  contract = {this.props.contract}
                     {...props}
                  />} />
                  <Route path="/charity" component={() => <AddCharity 
                    contract = {this.props.contract}
                  />} />
                </Switch>
              </Router>
          </div>
        )
    }

}
