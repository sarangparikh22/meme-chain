import React, { Component } from 'react'
import { Badge, Breadcrumb, Button, Navbar, Nav, NavDropdown, Form, FormControl, Popover, OverlayTrigger, Container } from 'react-bootstrap';

export class NavComp extends Component {
    render() {
        return (
            <div>
                <div className="row navigation-row">
                    <div className="logo-section">
                        <a href="/"><img src={require('../meme-chain.png')} alt="Meme-Chain" /></a>
                    </div>
                    <div className="nav-section ml-auto">
                        <ul>
                        <li>
                            <a href={"/"}>Explore</a>
                        </li>
                        <li>
                            <a href={"/createTrend"}>Create Trend</a>
                        </li>
                        <li>
                        {
                        this.props.acctID == null ? 
                        <a onClick={this.props.reqSignIn}>Sign In </a>
                        :
                        
                        <a onClick={this.props.reqSignOut}>{this.props.acctID} - Sign Out</a>
                        }
                        </li>
                        </ul>
                    </div>
                    {
                        this.props.acctID == null ? "" :
                        <span>
                            <Badge pill variant="light">
                                {this.props.userBalance  + " Ⓝ"}
                            </Badge>{' '}
                        </span>
                    }
                </div>
                    
            </div>
        )
    }
}

export default NavComp
