import React, { Component } from 'react'
import { Badge, Breadcrumb, CardColumns, Button, Navbar, Modal, NavDropdown, Form, FormControl, Popover, OverlayTrigger, Container } from 'react-bootstrap';
import ipfs from '../ipfs'
import Post from './Post'

export class View extends Component {
    constructor(props){
        super(props);
        this.state ={posts: [], ipfsURL: "", topicName: "", show: false}
    }
    handleClose = () => this.setState({show: false});
    handleShow = () => this.setState({show: true});
    captureFile (event)  {
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)    
      }

    async convertToBuffer(reader) {
      //file is converted to a buffer to prepare for uploading to IPFS
      const buffer = await Buffer.from(reader.result);
      //set this buffer -using es6 syntax
      this.setState({buffer});
      ipfs.add(this.state.buffer)
      .then( (hash) => {
          console.log(hash);
          this.setState({ipfsURL: hash[0].hash})
      })
    }
    handleOption = (event) =>
    {
        let selectedValue = event.target.value;
        console.log(selectedValue)
        this.setState({optionSelected: selectedValue})
    }

    async upload(){
        let topicID = this.props.match.params.id;
        await this.props.contract.addPost({topicID: topicID, charity: this.state.optionSelected, ipfsURL: this.state.ipfsURL})
        alert('done');

    }
    async componentDidMount(){
        let topicID = this.props.match.params.id;
        const { contract } = this.props
        let topicName = await contract.getTopicDetails({topicID})
        console.log(topicName.name)
        this.setState({topicName: topicName.name})
        let posts = [];
        let postsD = [];
        posts = await contract.getPostsForTopic({topicID: topicID})
        for(let i = 0; i < posts.length; i++){
            postsD[i] = await contract.getPostDetails({postID: posts[i]})
        }
        this.setState({posts: postsD})
        let totalCharity = [];
        totalCharity = await contract.showCharity();
        let options = totalCharity.map((c,id) => {
            return  (
                <option key={c} value={id}>{c}</option>
            )
        })
        this.setState({options})        
    }
    render() {
        return (
            <div>
                <div>
                    {this.state.topicName  ?  <h1 className="row navigation-row titlewa">Trend #{this.state.topicName} <button onClick={this.handleShow.bind(this)} style={{margin: "10px" ,fontSize: "1.5rem", padding: "5px"}} className="popup-button">upload your meme</button></h1> : ""}
                </div>
                <CardColumns style={{margin: "25px"}}>

                {this.state.posts.length > 0 ? 
                this.state.posts.map(post => {
                    return (
                        <Post 
                                contract={this.props.contract}
                                key={post.postID}
                                id={post.postID}
                                owner={post.owner}
                                ipfs={post.ipfsURL}
                                amt={post.donated || 0}
                            />
                    )
                }) 
                : <h1 style={{ color: "white"}}className="row navigation-row">No Posts</h1>}
                </CardColumns>

                <Modal show={this.state.show} onHide={this.handleClose.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Meme</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Select Charity <select onChange={(e) => this.setState({ optionSelected: e.target.value })}>
                <option>Select Charity</option>
                {this.state.options}
            </select>
            <br />
            <Form.Label>Upload Meme: </Form.Label><Form.Control type="file" onChange={this.captureFile.bind(this)}/><br />
            <Form.Label>Meme IPFS Hash: {this.state.ipfsURL}</Form.Label> <br />      
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose.bind(this)}>
            Close
          </Button>
          <Button variant="primary" onClick={this.upload.bind(this)}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
            </div>
        )
    }
}

export default View
