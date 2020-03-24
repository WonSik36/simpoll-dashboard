import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
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
            },
            currentRoomId: null
        }

        this.fetchTemplate = this.fetchTemplate.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.getRoomList = this.getRoomList.bind(this);
        this.changePersonType = this.changePersonType.bind(this);
        this.search = this.search.bind(this);
        this.updateVoteList = this.updateVoteList.bind(this);
        this.getVoteResult = this.getVoteResult.bind(this);
        this.submitVote = this.submitVote.bind(this);
        this.createVote = this.createVote.bind(this);
        this.createRoom = this.createRoom.bind(this);
        this.deleteVote = this.deleteVote.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
        this.updateChoice = this.updateChoice.bind(this);
        this.participateRoom = this.participateRoom.bind(this);
    }

    componentDidMount(){
        // get user from server
        this.getUserInfo();

        // get room list from server
        // this.getRoomList(true);
    }

    fetchTemplate(url, requestBody, loadingState, callback){
        let oldState;
        if(loadingState !== null){
            oldState = this.state;
            this.setState(loadingState);
        }

        fetch(url,requestBody)
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
        this.fetchTemplate("/index.php/api/user",null,null,
            function(data){
                this.setState({
                    user: data
                });

                this.getRoomList(true);

            }.bind(this));
    }

    getRoomList(isAudience){
        let url;
        if(isAudience)
            url = "/index.php/api/user/"+this.state.user.sid+"/room?persontype=audience";
        else
            url = "/index.php/api/user/"+this.state.user.sid+"/room?persontype=speacker";

        let _roomList = Object.assign({}, this.state.roomList, {isLoading:true});
        this.fetchTemplate(url,null,{roomList:_roomList},
            function(data){
                this.setState({
                    roomList:{
                        isLoading: false,
                        items: data
                    },
                });

                if(data.length > 0){
                    this.updateVoteList(data[0].sid, isAudience);
                }
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
            url += "room/";
        }else{
            url += "group/";
        }

        url += searchWord;

        if(isNaN(searchWord)){
            url += "?type=url"
        }else{
            url += "?type=id"
        }

        this.fetchTemplate(url, null,loadingState,
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
        this.setState({currentRoomId: sid});

        let loadingState = {
            voteList:{
                isLoading: true,
                items: []
            }
        };
        let url;
        if(isAudience){
            url = "/index.php/api/room/"+sid+"/vote?userId="+this.state.user.sid+"&persontype=audience";
        }else{
            url = "/index.php/api/room/"+sid+"/vote?userId="+this.state.user.sid+"&persontype=speacker";
        }

        this.fetchTemplate(url,null,loadingState,
            function(data){

                data = this.checkDeadlineAndSortVoteList(data);
                this.setState({
                    voteList:{
                        isLoading: false,
                        items: data
                    }
                });

                this.getVoteResult(0,true,isAudience);//청중이든 강연자든 결과를받아오기
            }.bind(this));
    }

    // get vote result
    // this will be called vote in vote list was voted by user
    getVoteResult(idx, continuous, isAudience){
        if(idx >= this.state.voteList.items.length)
            return;

        let _voted = this.state.voteList.items[idx].voted;
        let _isDeadlinePass = this.state.voteList.items[idx].isDeadlinePass;

        // not voted
        if(isAudience && _voted === false && _isDeadlinePass === false){
            this.getVoteResult(idx+1, continuous, isAudience);
            return;
        }

        // get vote sid
        let voteId = this.state.voteList.items[idx].vote_id;

        // set url
        let url = null;
        if(isAudience){
            url = "/index.php/api/choice?voteId="+voteId+"&userId="+this.state.user.sid+"&persontype=audience";
        }else{
            url = "/index.php/api/choice?voteId="+voteId+"&userId="+this.state.user.sid+"&persontype=speacker";
        }

        // get vote result
        this.fetchTemplate(url,null,null,
            function(data){
                let _newVote = Object.assign(this.state.voteList.items[idx],{result: data});
                this.state.voteList.items[idx] = _newVote;
                this.setState({
                    voteList: this.state.voteList
                });

                if(continuous)
                    this.getVoteResult(idx+1,continuous,isAudience);
            }.bind(this));
    }

    // this will be called when vote is submitted
    submitVote(choice){
        let idx = choice.idx;
        choice.user_id = this.state.user.sid;

        let requestBody = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(choice)
        }

        this.fetchTemplate("/index.php/api/choice",requestBody,null,
            function(data){
                this.state.voteList.items[idx].voted=true;
                this.setState({voteList: this.state.voteList});
                this.getVoteResult(idx,false,this.state.personType==="audience");
            }.bind(this));
    }

    createVote(vote){
        vote.user_id = this.state.user.sid;
        vote.user_nickname = this.state.user.nickname;

        let requestBody = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vote)
        };

        this.fetchTemplate("/index.php/api/group",requestBody,null,
            function(data){
                this.updateVoteList(this.state.currentRoomId, false);
            }.bind(this));
    }

    createRoom(room){
        room.master = this.state.user.sid;
        room.master_nickname = this.state.user.nickname;

        let requestBody = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(room)
        };

        this.fetchTemplate("/index.php/api/room",requestBody,null,
            function(data){
                this.getRoomList(false);
            }.bind(this));
    }

    deleteVote(voteId){
        let requestBody = {
            method: 'DELETE'
        };

        this.fetchTemplate("/index.php/api/vote/"+voteId,requestBody,null,
            function(data){
                this.updateVoteList(this.state.currentRoomId,false);
            }.bind(this));
    }

    deleteRoom(roomId){
        let requestBody = {
            method: 'DELETE'
        };

        this.fetchTemplate("/index.php/api/room/"+roomId,requestBody,null,
            function(data){
                this.getRoomList(false);
            }.bind(this));
    }

    updateChoice(choice){
        let idx = choice.idx;
        choice.user_id = this.state.user.sid;

        let requestBody = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(choice)
        }

        let url = "/index.php/api/choice/"+choice.choice_id;

        this.fetchTemplate(url,requestBody,null,
            function(data){
                this.getVoteResult(idx,false,this.state.personType==="audience");
            }.bind(this));
    }

    participateRoom(roomId){
        let url = "/index.php/api/room/"+roomId+"/user";
        let requestBody = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({user_id:this.state.user.sid})
        };

        this.fetchTemplate(url,requestBody,null,
            function(data){
                this.changePersonType(true);
            }.bind(this));
    }

    checkDeadlineAndSortVoteList(voteList){
        let curDate = new Date();
        for(let i=0;i<voteList.length;i++){
            let deadlineDate = new Date(voteList[i].deadline);
            if(deadlineDate <= curDate)
                voteList[i].isDeadlinePass = true;
            else
                voteList[i].isDeadlinePass = false;
        }

        voteList.sort(function(v1,v2){
            let v1Cond = v1.voted || v1.isDeadlinePass;
            let v2Cond = v2.voted || v2.isDeadlinePass;

            // 둘다 투표를한경우 혹은 둘다 안한경우
            if((v1Cond && v2Cond)||(!v1Cond && !v2Cond)){
                if(v1.sid>v2.sid){
                    return -1;
                }else{
                    return 1;
                }
            // v1만 투표를 한 경우
            }else if(v1Cond && !v2Cond){
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
                        onVoteSubmit={this.submitVote}
                        onUpdateChoice={this.updateChoice}
                        onVoteRefresh={this.getVoteResult}
                    />;
        }else{
            _main = <MainSpeacker
                        room-list-data={this.state.roomList}
                        onRoomClick={this.updateVoteList}
                        vote-list-data={this.state.voteList}
                        onVoteSubmit={this.submitVote}
                        onVoteCreate={this.createVote}
                        onRoomCreate={this.createRoom}
                        onVoteDelete={this.deleteVote}
                        onRoomDelete={this.deleteRoom}
                        onVoteRefresh={this.getVoteResult}
                        currentRoomId={this.state.currentRoomId}
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
