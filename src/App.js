import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import Navigation from './components/Navigation';
import AlertBox from './components/AlertBox';
import SearchBox from './components/SearchBox';
import MainAudience from './components/MainAudience';
import MainSpeaker from './components/MainSpeaker';
import ModeButton from './components/ModeButton';

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            viewmode: "audience",
            currentRoomId: null,
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
            simpollList: {
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
        this.changeViewMode = this.changeViewMode.bind(this);
        this.search = this.search.bind(this);
        this.getSimpollList = this.getSimpollList.bind(this);
        this.getSimpoll = this.getSimpoll.bind(this);
        this.submitSimpoll = this.submitSimpoll.bind(this);
        this.createSimpoll = this.createSimpoll.bind(this);
        this.createRoom = this.createRoom.bind(this);
        this.deleteSimpoll = this.deleteSimpoll.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
        this.participateRoom = this.participateRoom.bind(this);
        this.parseSimpollList = this.parseSimpollList.bind(this);
        this.parseSimpoll = this.parseSimpoll.bind(this);
        this.parseQuestion = this.parseQuestion.bind(this);
        this.checkUserVoted = this.checkUserVoted.bind(this);
        this.checkDeadlinePassed = this.checkDeadlinePassed.bind(this);
        this.sortSimpollList = this.sortSimpollList.bind(this);
    }

    componentDidMount(){
        this.getUserInfo();
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
        let url = "/index.php/api/user";
        // let url = "/user.json";

        this.fetchTemplate(url,null,null,
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

        // let url = "/roomList.json"

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
                    this.getSimpollList(data[0].sid);
                }
            }.bind(this));
    }

    changeViewMode(isAudience){
        if(isAudience){
            this.setState({
                viewmode: "audience"
            })
        }else{
            this.setState({
                viewmode: "speaker"
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
            url += "simpoll/";
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

    // get simpoll list
    getSimpollList(sid){
        this.setState({currentRoomId: sid});

        let loadingState = {
            simpollList:{
                isLoading: true,
                items: []
            }
        };

        let url = "/index.php/api/room/"+sid+"/simpoll";
        // let url = "/simpollList.json"

        this.fetchTemplate(url,null,loadingState,
            function(data){
                data = this.parseSimpollList(data);
                data = this.sortSimpollList(data);
                this.setState({
                    simpollList:{
                        isLoading: false,
                        items: data
                    }
                });

            }.bind(this));
    }

    // get simpoll
    getSimpoll(idx){
        // get simpoll sid
        let simpollId = this.state.simpollList.items[idx].sid;

        // set url
        let url = "/index.php/api/simpoll/"+simpollId;
        // let url = "/simpoll.json";

        // get simpoll result
        this.fetchTemplate(url,null,null,
            function(data){
                data = this.parseSimpoll(data);
                this.state.simpollList.items[idx] = data;
                let _simpollList = this.sortSimpollList(this.state.simpollList.items);
                this.setState({
                    simpollList: _simpollList
                });

            }.bind(this));
    }

    /*
        options:{
            idx: {simpoll Idx},
            data: [...option_id]
        }
    */
    submitSimpoll(options){
        let idx = options.idx;

        let requestBody = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(options.data)
        }

        this.fetchTemplate("/index.php/api/option",requestBody,null,
            function(data){
                this.getSimpoll(idx);
            }.bind(this));
    }

    /*
        simpoll: {
            "room_id":1,
            "title": "simpoll1",
            "url_name": "url1",
            "user_id":"1",
            "user_nickname":"nickname1",
            "deadline": "2020-03-29 23:00:00",
            "is_comment_enbale": "0",
            "is_anonymous": "0",
            "part_auth" : "0",
            "questions":[
                {
                    "question_title":"question 1",
                    "choice_no":"4",
                    "question_type":"0",
                    "options":["option1","option2","option3"]
                },
                {
                    "question_title":"question 2",
                    "choice_no":"4",
                    "question_type":"0",
                    "options":["option1","option2","option3"]
                },
                ...
            ]
        }
    */
    createSimpoll(simpoll){
        simpoll.user_id = this.state.user.sid;
        simpoll.user_nickname = this.state.user.nickname;

        let requestBody = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(simpoll)
        };

        this.fetchTemplate("/index.php/api/simpoll",requestBody,null,
            function(data){
                this.getSimpollList(this.state.currentRoomId);
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

    deleteSimpoll(simpollId){
        let requestBody = {
            method: 'DELETE'
        };

        this.fetchTemplate("/index.php/api/simpoll/"+simpollId,requestBody,null,
            function(data){
                this.getSimpollList(this.state.currentRoomId);
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
                this.changeViewMode(true);
            }.bind(this));
    }

    /*
        simpoll+question+option 조인된 로우(여러 심폴)들을 simpoll id 순으로 정렬 및 파싱
    */
    parseSimpollList(simpollList){
        // sort
        simpollList.sort(function(s1,s2){
            let simpollId1 = Number(s1.simpoll_id);
            let simpollId2 = Number(s2.simpoll_id);

            if(simpollId1 >= simpollId2){
                return -1;
            }else if(simpollId1 < simpollId2){
                return 1;
            }
        });

        // parse
        let parsedSimpllList = [];
        let bIdx = 0;
        let eIdx = 0;
        let beforeSimpollId = simpollList[0].simpoll_id;
        for(eIdx=0;eIdx<simpollList.length;eIdx++){
            if(beforeSimpollId != simpollList[eIdx].simpoll_id){
                let simpoll = simpollList.slice(bIdx,eIdx);
                let parsedSimpoll = this.parseSimpoll(simpoll);
                parsedSimpllList.push(parsedSimpoll);
                bIdx = eIdx;
            }

            beforeSimpollId = simpollList[eIdx].simpoll_id
        }
        let simpoll = simpollList.slice(bIdx,eIdx);
        let parsedSimpoll = this.parseSimpoll(simpoll);
        parsedSimpllList.push(parsedSimpoll);

        return parsedSimpllList;
    }

    /*
        simpoll+question+option 조인된 로우(심폴 하나)들을 question_id 및 option_id 순으로 정렬 및 심폴로 파싱
    */
    parseSimpoll(simpoll){
        this.checkDeadlinePassed(simpoll);
        let parsedSimpoll = {
            sid: simpoll[0].simpoll_id,
            room_id: simpoll[0].room_id,
            title: simpoll[0].simpoll_title,
            url_name: simpoll[0].url_name,
            user_id: simpoll[0].user_id,
            user_nickname: simpoll[0].user_nickname,
            deadline: simpoll[0].deadline,
            is_comment_enable: simpoll[0].is_comment_enable,
            is_anonymous: simpoll[0].is_anonymous,
            part_auth: simpoll[0].part_auth,
            create_date: simpoll[0].create_date,
            questions:[]
        }

        if(this.state.viewmode === 'audience'){
            let voted = this.checkUserVoted(simpoll);
            parsedSimpoll.voted = voted;
        }
        

        // sort questions
        simpoll.sort(function(s1,s2){
            let questionId1 = Number(s1.qustion_id);
            let questionId2 = Number(s2.qustion_id);

            if(questionId1 < questionId2){
                return -1;
            }else if(questionId1 > questionId2){
                return 1;
            }else{
                let optionId1 = Number(s1.option_id);
                let optionId2 = Number(s2.option_id);
                
                if(optionId1 < optionId2){
                    return -1;
                }else{
                    return 1;
                } 
            }   
        });

        // parse
        let bIdx = 0;
        let eIdx = 0;
        let beforeQuestionId = simpoll[0].question_id;
        for(eIdx=0;eIdx<simpoll.length;eIdx++){
            if(beforeQuestionId != simpoll[eIdx].question_id){
                let question = simpoll.slice(bIdx, eIdx);
                let parsedQuestion = this.parseQuestion(question);
                parsedSimpoll.questions.push(parsedQuestion);
                bIdx = eIdx;
            }

            beforeQuestionId = simpoll[eIdx].question_id;
        }

        let question = simpoll.slice(bIdx, eIdx);
        let parsedQuestion = this.parseQuestion(question);
        parsedSimpoll.questions.push(parsedQuestion);

        return parsedSimpoll
    }

    /*
        simpoll+question+option 조인된 로우(문항 하나)들을 문항으로 파싱
    */
    parseQuestion(question){
        let parsedQuestion = {
            sid: question[0].question_id,
            question_title: question[0].question_title,
            choice_no: question[0].choice_no,
            question_type: question[0].question_type,
            options: []
        }

        // parse
        for(let i=0;i<question.length;i++){
            let option = {
                option_name: question[i].option_name,
                option_id: question[i].option_id,
                option_user_id: question[i].option_user_id.split('|'),
                option_user_nickname: question[i].option_user_nickname.split('|'),
                count: question[i].count
            };

            if(this.state.viewmode === 'audience'){
                option.voted = false;
                for(let j=0;j<option.option_user_id.length;j++){
                    if(option.option_user_id[j] === this.state.user.sid){
                        option.voted = true;
                    }
                }
            }

            parsedQuestion.options.push(option);
        }

        // sort options
        parsedQuestion.options.sort(function(o1,o2){
            let optionId1 = Number(o1.option_id);
            let optionId2 = Number(o2.option_id);

            if(optionId1< optionId2){
                return -1;
            }else{
                return 1;
            }
        });

        return parsedQuestion;
    }

    /*
        simpoll+question+option 조인된 로우(심폴 하나)들의 마감기간 지난 여부를 확인
    */
    checkDeadlinePassed(simpoll){
        let curDate = new Date();
        let deadlineDate = new Date(simpoll[0].deadline);
        if(deadlineDate <= curDate)
            simpoll[0].isDeadlinePass = true;
        else
            simpoll[0].isDeadlinePass = false;
    }

    /*
        simpoll+question+option 조인된 로우(심폴 하나)들의 투표 여부를 확인
    */
    checkUserVoted(simpoll){
        for(let i=0;i<simpoll.length;i++){
            let optionUserId = simpoll[i].option_user_id;
            for(let j=0;j<optionUserId.length;j++){
                if(optionUserId[j] === this.state.user.sid)
                    return true;
            }
        }

        return false;
    }

    /*
        구조화된 simpoll들의 리스트를 정렬
    */
    sortSimpollList(simpollList){
        // viewmode 가 청중일시 voted 여부와 deadline pass 여부 그리고 simpoll id를 기준으로 정렬
        if(this.state.viewmode === 'audience'){
            simpollList.sort(function(s1,s2){
                let votedOrDeadlinePassed1 = s1.voted || s1.isDeadlinePass;
                let votedOrDeadlinePassed2 = s2.voted || s2.isDeadlinePass;

                if(!votedOrDeadlinePassed1 && votedOrDeadlinePassed2){
                    return -1;
                }else if(votedOrDeadlinePassed1 && !votedOrDeadlinePassed2){
                    return 1;
                }else{
                    let simpollId1 = Number(s1.simpoll_id);
                    let simpollId2 = Number(s2.simpoll_id);
                    if(simpollId1 < simpollId2){
                        return 1;
                    }else{
                        return -1;
                    }
                }
            });

        // viewmode 가 강연자일시 deadline pass 여부 그리고 simpoll id를 기준으로 정렬
        }else{
            simpollList.sort(function(s1,s2){
                if(!s1.isDeadlinePass && s2.isDeadlinePass){
                    return -1;
                }else if(s1.isDeadlinePass && !s2.isDeadlinePass){
                    return 1;
                }else{
                    let simpollId1 = Number(s1.simpoll_id);
                    let simpollId2 = Number(s2.simpoll_id);
                    if(simpollId1 < simpollId2){
                        return 1;
                    }else{
                        return -1;
                    }
                }
            });
        }

        return simpollList;
    }

    render() {
        let _main = null;
        if(this.state.viewmode == 'audience'){
            _main = <MainAudience
                        room-list-data={this.state.roomList}
                        onRoomClick={this.getSimpollList}
                        simpoll-list-data={this.state.simpollList}
                        onSimpollSubmit={this.submitSimpoll}
                        onUpdateChoice={this.updateChoice}
                        onSimpollRefresh={this.getSimpoll}
                    />;
        }else{
            _main = <MainSpeaker
                        room-list-data={this.state.roomList}
                        onRoomClick={this.getSimpollList}
                        simpoll-list-data={this.state.simpollList}
                        onSimpollCreate={this.createSimpoll}
                        onRoomCreate={this.createRoom}
                        onSimpollDelete={this.deleteSimpoll}
                        onRoomDelete={this.deleteRoom}
                        onSimpollRefresh={this.getSimpoll}
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
                <ModeButton viewmode={this.state.viewmode} onViewModeChange={this.changeViewMode} />

                <Row className="m-2">
                    {_main}
                </Row>
            </Container>
        );
    }
}

export default App;
