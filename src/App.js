import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import Navigation from './components/Navigation'
import AlertBox from './components/AlertBox'
import SearchBox from './components/SearchBox'
import Main from './components/Main'

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            user: {
                email: null,
                name: null,
                nickname: null
            },
            searchResult:{
                isLoading: false,
                item: {
                    "title":null,
                    "cur_name":null
                }
            },
            roomList: {
                isLoading: false,
                items: []
            },
            voteList: {
                isLoading: false,
                items: []
            }
        }

        this.search = this.search.bind(this);
    }

    componentDidMount(){
        // get user from server
        fetch("/user.json")
            .then((res)=>{
                return res.json();
            }).then(function(json){
                this.setState({
                    user: json
                });
            }.bind(this));

        // get room list from server
        let _roomList = Object.assign({}, this.state.roomList, {isLoading:true});
        this.setState({roomList:_roomList});
        fetch("/roomList.json")
            .then((res)=>{
                return res.json();
            }).then(function(json){
                this.setState({
                    roomList:{
                        isLoading: false,
                        items: json
                    }
                });
            }.bind(this));
    }

    search(searchWord, searchType){
        this.setState({
            searchResult:{
                isLoading: true,
                item: {
                    "title":null,
                    "cur_name":null
                }
            }
        });

        fetch("/search.json")
            .then((res)=>{
                return res.json();
            }).then(function(json){
                this.setState({
                    searchResult:{
                        isLoading: false,
                        item: json
                    }
                });
            }.bind(this));
    }

    render() {
        return (
            <Container className="p-0">
                <Navigation user={this.state.user.nickname}>Simpoll</Navigation>
                <Row className="m-2">
                    <Col xs={12} md={6} className="p-1">
                        <AlertBox/>
                    </Col>
                    <Col xs={12} md={6} className="p-1">
                        <SearchBox onSubmit={this.search} data={this.state.searchResult}/>
                    </Col>
                </Row>
                <Row className="m-2">
                    <Main room-list-data={this.state.roomList}/>
                </Row>
            </Container>
        );
    }
}

export default App;