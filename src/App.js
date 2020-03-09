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
        this.updateVoteList = this.updateVoteList.bind(this);
        this.getVoteResult = this.getVoteResult.bind(this);
        this.onVoteSubmit = this.onVoteSubmit.bind(this);
        this.parseResponse = this.parseResponse.bind(this);
    }

    componentDidMount(){
        // get user from server
        fetch("/index.php/api/user")
            .then((res)=>{
                return res.json();
            }).then(function(json){
                this.parseResponse(json,function(data){
                    this.setState({
                        user: data
                    });
                }.bind(this));
            }.bind(this));

        // get room list from server
        let _roomList = Object.assign({}, this.state.roomList, {isLoading:true});
        this.setState({roomList:_roomList});
        fetch("/index.php/api/find_user_rooms")
            .then((res)=>{
                return res.json();
            }).then(function(json){
                this.parseResponse(json,function(data){
                    this.setState({
                        roomList:{
                            isLoading: false,
                            items: data
                        }
                    });
                    if(data.length > 0)
                        this.updateVoteList(data[0].sid);
                }.bind(this));
            }.bind(this));
    }

    search(searchWord, searchType){
        this.setState({
            searchResult:{
                isLoading: true,
                item: {}
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
                this.parseResponse(json,function(data){
                    this.setState({
                        searchResult:{
                            isLoading: false,
                            item: data
                        }
                    });
                }.bind(this));
            }.bind(this));
    }

    // update vote list
    updateVoteList(sid){
        this.setState({
            voteList:{
                isLoading: true,
                items: []
            }
        });

        fetch("/index.php/api/find_room_votes/"+sid)
            .then((res)=>{
                return res.json();
            }).then(function(json){
                this.parseResponse(json,function(data){
                    this.setState({
                        voteList:{
                            isLoading: false,
                            items: data
                        }
                    });

                    /* update already voted to result */
                    this.getVoteResult(0,true);
                }.bind(this));
            }.bind(this));
    }

    // get vote result
    // this will be called vote in vote list was voted by user
    getVoteResult(idx, continuous){
        if(idx >= this.state.voteList.items.length)
            return;

        // not voted
        if(this.state.voteList.items[idx].voted === false){
            this.getVoteResult(idx+1, continuous);
            return;
        }

        // get vote sid
        let sid = this.state.voteList.items[idx].sid;

        // get vote result
        fetch("/index.php/api/return_vote_result/"+sid)
            .then((res)=>{
                return res.json();
            }).then(function(json){
                this.parseResponse(json,function(data){
                    data.title = this.state.voteList.items[idx].title;
                    this.state.voteList.items[idx] = data;
                    this.setState({
                        voteList: this.state.voteList
                    });

                    if(continuous)
                        this.getVoteResult(idx+1,continuous);
                }.bind(this));
            }.bind(this));
    }

    // this will be called when vote is submitted
    onVoteSubmit(e){
        let contents_number = e.currentTarget['contents_number'].value;
        let vote_id = e.currentTarget['vote_id'].value
        let idx = e.currentTarget['idx'].value;
        let resBody = {
            "contents_number": contents_number,
            "vote_id": vote_id
        }
        fetch("/index.php/api/voting",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(resBody)
        }).then(function(res){
            return res.json();
        }).then(function(json){
            if(json.result == "success"){
                this.state.voteList.items[idx].voted = true;
                this.getVoteResult(idx,false);
            }else{
                alert(json.message);
            }
        }.bind(this));

    }

    render() {
        return (
            <Container className="p-0">
                <Navigation user={this.state.user} href="/index.php/home">Simpoll</Navigation>
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
                        onRoomClick={this.updateVoteList}
                        vote-list-data={this.state.voteList} 
                        onVoteSubmit={this.onVoteSubmit}
                    />
                </Row>
            </Container>
        );
    }

    parseResponse(res, callback){
        if(res.result == "success"){
            callback(res.data);
        }else{
            alert(res.message);
        }
    }
}

export default App;