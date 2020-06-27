import React, { Component } from 'react'
import SearchComp from './SearchComp'
import Topic from './Topic'
import { ListGroup, Card, Breadcrumb, Button, Navbar, Nav, NavDropdown, Form, FormControl, Popover, OverlayTrigger, Container } from 'react-bootstrap';

export class Home extends Component {
    constructor(props){
        super(props);
        this.state = {topics: []}
    }
    async componentWillMount(){
        const { contract } = this.props;
        let totalTopics = await contract.totalTopics();
        let topics = []
        for(let i=0;i<totalTopics;i++){
            topics.push(await contract.getTopicDetails({topicID: `${i}`}))
            console.log(topics[i]);
        }
        this.setState({topics})
    }
    render() {
        return (
            <div>
                <SearchComp />
                <div>
                    {
                        this.state.topics.length > 0 ?
                        this.state.topics.map(topic => {
                            return (
                            <ListGroup className="row">
                            <Topic 
                                contract = {this.props.contract}
                                key = {topic.topicID}
                                id = {topic.topicID}
                                name = {topic.name}
                                owner = {topic.owner}
                            />
                            </ListGroup>)
                        }) : <div className="row navigation-row">{"No Trend to Show"}</div>
                    }
                </div>
            </div>
        )
    }
}

export default Home
