import React, { Component } from 'react'

export class SearchComp extends Component {
    render() {
        return (
            <div>
                <div className="row search-row">
                <input type="text" id="searchtext" placeholder="Search Trends..." />
                <button id="searchgifs" type="submit" ><i className="fa fa-search"></i></button>
                </div>
            </div>
        )
    }
}

export default SearchComp
