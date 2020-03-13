import React from 'react';
import {Container, Row, Col, ButtonToolbar, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';
import Navigation from './components/Navigation';
import AlertBox from './components/AlertBox';
import SearchBox from './components/SearchBox';
import MainAudience from './components/MainAudience';
import MainSpeacker from './components/MainSpeacker';
import ModeButton from './components/ModeButton';

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            personType: "audience",
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

        this.fetchTemplate = this.fetchTemplate.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.getRoomList = this.getRoomList.bind(this);
        this.changePersonType = this.changePersonType.bind(this);
        this.search = this.search.bind(this);
        this.updateVoteList = this.updateVoteList.bind(this);
        this.getVoteResult = this.getVoteResult.bind(this);
        this.onVoteSubmit = this.onVoteSubmit.bind(this);
        this.participateRoom = this.participateRoom.bind(this);
    }

    componentDidMount(){
        // get user from server
        this.getUserInfo();

        // get room list from server
        this.getRoomList(true);
    }

    fetchTemplate(url, loadingState, callback){
        let oldState;
        if(loadingState !== null){
            oldState = this.state;
            this.setState(loadingState);
        }

        fetch(url)
            .then((res)=>{
                return res.json();
            }).then((json)=>{
                return new Promise((resolve, reject)=>{
                    if(json.result == "success"){
                        resolve(json.data);
                    }else{
                        reject(new Error(json.message));
                    }
                });
            }).then((data)=>{callback(data)})
            .catch(function(err){
                alert(err.message);
                if(loadingState !== null){
                    this.setState(oldState);
                }
            }.bind(this));
    }

    getUserInfo(){
        this.fetchTemplate("/user.json",null,
            function(data){
                this.setState({
                    user: data
                });
            }.bind(this));
    }

    getRoomList(isAudience){
        let url;
        if(isAudience)
            url = "/roomList.json";
        else
            url = "/roomList.json";

        let _roomList = Object.assign({}, this.state.roomList, {isLoading:true});
        this.fetchTemplate(url,{roomList:_roomList},
            function(data){
                this.setState({
                    roomList:{
                        isLoading: false,
                        items: data
                    }
                });
                if(data.length > 0)
                    this.updateVoteList(data[0].sid, isAudience);
            }.bind(this));
    }

    changePersonType(isAudience){
        if(isAudience){
            this.setState({
                personType: "audience"
            })
        }else{
            this.setState({
                personType: "speacker"
            })
        }
        this.getRoomList(isAudience);
    }

    search(searchWord, searchType){
        let loadingState = {
            searchResult:{
                isLoading: true,
                item: {}
            }
        };

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

        this.fetchTemplate("/search.json", loadingState,
            function(data){
                this.setState({
                    searchResult:{
                        isLoading: false,
                        item: data
                    }
                });
            }.bind(this));
    }

    // update vote list
    updateVoteList(sid, isAudience){
        let loadingState = {
            voteList:{
                isLoading: true,
                items: []
            }
        };
        
        let url;
        if(isAudience){
            url = "voteList.json";
        }else{
            url = "voteListSpeacker.json";
        }

        this.fetchTemplate(url,loadingState,
            function(data){

                data = this.checkDeadlineAndSortVoteList(data);
                this.setState({
                    voteList:{
                        isLoading: false,
                        items: data
                    }
                });

                /* update already voted to result */
                if(isAudience)
                    this.getVoteResult(0,true);
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
        this.fetchTemplate("/voteResult.json",null,
            function(data){
                let _newVote = Object.assign(this.state.voteList.items[idx],{result: data});
                this.state.voteList.items[idx] = _newVote;
                this.setState({
                    voteList: this.state.voteList
                });

                if(continuous)
                    this.getVoteResult(idx+1,continuous);
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

        this.fetchTemplate("/voteResult.json",null,
            function(data){
                this.state.voteList.items[idx].voted = true;
                this.getVoteResult(idx,false);
            }.bind(this));
    }

    participateRoom(roomId){
        fetch("url")
            .then(function(res){
                return res.json();
            }).then(function(json){
                // this.parseResponse
            }.bind(this))
            
        this.changePersonType(true);
    }

    checkDeadlineAndSortVoteList(voteList){
        let curDate = new Date();
        for(let i=0;i<voteList.length;i++){
            let deadlineDate = new Date(voteList[i].deadline);
            if(deadlineDate <= curDate)
                voteList[i].voted = true;
        }

        voteList.sort(function(v1,v2){

            // 둘다 투표를한경우 혹은 둘다 안한경우
            if((v1.voted && v2.voted)||(!v1.voted && !v2.voted)){
                if(v1.sid>v2.sid){
                    return -1;
                }else{
                    return 1;
                }
            // v1만 투표를 한 경우
            }else if(v1.voted && !v2.voted){
                return 1;
            // v2만 투표를 한 경우
            }else{
                return -1;
            }
        });

        return voteList;
    }

    render() {
        let _main = null;
        if(this.state.personType == 'audience'){
            _main = <MainAudience 
                        room-list-data={this.state.roomList} 
                        onRoomClick={this.updateVoteList}
                        vote-list-data={this.state.voteList} 
                        onVoteSubmit={this.onVoteSubmit}
                    />;
        }else{
            _main = <MainSpeacker 
                        room-list-data={this.state.roomList} 
                        onRoomClick={this.updateVoteList}
                        vote-list-data={this.state.voteList} 
                        onVoteSubmit={this.onVoteSubmit}
                    />
        }

        return (
            <Container className="p-0">
                <Navigation user={this.state.user} href="/index.php/home">Simpoll</Navigation>
                <Row className="m-2">
                    <Col xs={12} md={6} className="p-1">
                        <AlertBox data={this.alertList}/>
                    </Col>
                    <Col xs={12} md={6} className="p-1">
                        <SearchBox onSubmit={this.search} data={this.state.searchResult} addRoom={this.participateRoom}/>
                    </Col>
                </Row>
                <ModeButton personType={this.state.personType} onPersonTypeChange={this.changePersonType} />
                
                <Row className="m-2">
                    {_main}
                </Row>
            </Container>
        );
    }
}

export default App;