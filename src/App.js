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
            },
            alertList: {
                isLoading: false,
                items: []
            }
        }

        this.search = this.search.bind(this);
        this.onRoomClick = this.onRoomClick.bind(this);
        this.getVoteResult = this.getVoteResult.bind(this);
        this.onVoteSubmit = this.onVoteSubmit.bind(this);
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
        fetch("/index.php/api/find_user_rooms")
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

        let url = "/index.php/api/";
        if(searchType == "room"){
            url += "room_";
        }else{
            url += "vote_"
        }

        if(isNaN(searchWord)){
            url += "url/"
        }else{
            url += "page/"
        }

        fetch(url+searchWord)
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

    onRoomClick(sid){
        alert(sid);
    }

    getVoteResult(sid){

    }

    onVoteSubmit(e){

    }

    render() {
        return (
            <Container className="p-0">
                <Navigation user={this.state.user.nickname}>Simpoll</Navigation>
                <Row className="m-2">
                    <Col xs={12} md={6} className="p-1">
                        <AlertBox data={this.alertList}/>
                    </Col>
                    <Col xs={12} md={6} className="p-1">
                        <SearchBox onSubmit={this.search} data={this.state.searchResult}/>
                    </Col>
                </Row>
                <Row className="m-2">
                    <Main 
                        room-list-data={this.state.roomList} 
                        onRoomClick={this.onRoomClick}
                        vote-list-data={this.state.voteList} 
                        getVoteResult={this.getVoteResult}
                        onVoteSubmit={this.onVoteSubmit}
                    />
                </Row>
            </Container>
        );
    }
}

export default App;