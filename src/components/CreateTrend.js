import React, { Component } from 'react'

export class CreateTrend extends Component {
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    async createTopic(){
        const { contract } = this.props;
        await contract.createTopic({name: this.state.name});
        alert('done')
    }
    render() {
        return (
            <div>
                <div>
                    <h1 className="row navigation-row titlewa">Create a Trend</h1>
                </div>
                <div className="row navigation-row">
                <div className="form__group field">
                    <input type="input" className="form__field" onChange={this.handleChange.bind(this)} placeholder="Name" name="name" id='name' required />
                    <label htmlFor="name" className="form__label">Name of the Trend</label>
                </div>
                </div>
                <div className="row navigation-row">
                    <button className="popup-button" onClick={this.createTopic.bind(this)}>Create Trend</button>
                </div>
            </div>
        )
    }
}

export default CreateTrend
