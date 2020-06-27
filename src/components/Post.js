import React, { Component } from 'react'
import { Card, Button, Navbar, Modal, NavDropdown, Form, FormControl, Popover, OverlayTrigger, Container } from 'react-bootstrap';
import { isBlock } from 'typescript';

import Big from 'big.js'

const BOATLOAD_OF_GAS = Big(1).times(10 ** 16).toFixed()

export class Post extends Component {
    constructor(props){
        super(props)
        this.state = {show: false}
    }
    handleClose = () => this.setState({show: false});
    handleShow = () => this.setState({show: true});
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    async tip(){
        const { contract, id } = this.props
        await contract.tip({postID: id}, BOATLOAD_OF_GAS, Big(this.state.tip.toString()).times(10 ** 24).toFixed())
        alert('done')
    }

    render() {
        return (
            <>
            <Card className="card-hover">
                <Card.Img variant="top" src={"https://gateway.ipfs.io/ipfs/"+this.props.ipfs} />

                <Card.Footer className="card-hover reveal">
                    <small className="text-muted">By - {this.props.owner} $ - {this.props.amt}
                    <button onClick={() => this.setState({show: true})} style={{ display: "inline", marginLeft: "5px", padding: "0.3rem"}} className="popup-button"><i className="fa fa-money" /> Tip</button>
                    </small>
                </Card.Footer>
            </Card>

<Modal show={this.state.show} onHide={this.handleClose.bind(this)}>
<Modal.Header closeButton>
  <Modal.Title>Tip</Modal.Title>
</Modal.Header>
<Modal.Body>
<Form.Label>Enter Tip in NEAR</Form.Label><Form.Control type="number" name="tip" onChange={this.handleChange.bind(this)}/> <br />
</Modal.Body>
<Modal.Footer>
  <Button variant="secondary" onClick={this.handleClose.bind(this)}>
    Close
  </Button>
  <Button variant="primary" onClick={this.tip.bind(this)}>
    TIP
  </Button>
</Modal.Footer>
</Modal>
</>
        )
    }
}

export default Post
