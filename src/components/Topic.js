import React, { Component } from 'react'
import { Card, Breadcrumb, Button, Navbar, Nav, NavDropdown, Form, FormControl, Popover, OverlayTrigger, Container, ListGroup } from 'react-bootstrap';

export class Topic extends Component {
    constructor(props){
        super(props);
        this.state = {postName: [], load: false}
    }
    async componentWillMount(){
        const { contract, id } = this.props
        this.setState({redirectURL: "/view/" + id})
        let posts = [];
        posts = await contract.getPostsForTopic({topicID: id})
        let postName = [];
        if(posts.length > 10){
            for(let i = 0; i < 10; i++){
                postName.push(await contract.getPostDetails({postID: posts[i]}));
            }
        }else{
            for(let i=0; i < posts.length; i++) {
                postName.push(await contract.getPostDetails({postID: posts[i]}));
            }
        }
        this.setState({postName: postName, load: true})
    }
    render() {
        return (
            <div style={{margin: "10px"}}>
                <ListGroup.Item style={{backgroundColor: "#18181B", color: "white"}}><a href={this.state.redirectURL}>#{this.props.name}</a>
                <hr />
                {this.state.load === false ? <img src="https://i.gifer.com/XVo6.gif" height="100" width="100"/> : 
                    this.state.postName.length == 0 ? "No posts yet." :
                    this.state.postName.map(p => {
                        return (
                            <img src={"https://gateway.ipfs.io/ipfs/"+p.ipfsURL} height="100" width="100" />
                        )
                    })
                }
                </ListGroup.Item>
            </div>
        )
    }
}


export default Topic
