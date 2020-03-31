import React from 'react';
import {Modal, Form, Button} from 'react-bootstrap';

class RoomModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
            authType: "0",
            nameType: "0"
        }

        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.onChangeVoteCreateAuth = this.onChangeVoteCreateAuth.bind(this);
        this.onChangeUserNameType = this.onChangeUserNameType.bind(this);
        this.onRoomCreate = this.onRoomCreate.bind(this);
    }

    handleClose() {
        this.setState({
            show: false,
            authType: "0",
            nameType: "0"
        });
    }

    handleShow() {
        this.setState({show:true});
    }

    onChangeVoteCreateAuth(e){
        this.setState({authType: e.currentTarget.value});
    }

    onChangeUserNameType(e){
        this.setState({nameType: e.currentTarget.value});
    }

    onRoomCreate(e){
        e.preventDefault();
        this.handleClose();
        let _title = e.currentTarget.title.value;
        let _urlName = e.currentTarget.url_name.value;
        let _voteCreateAuth = e.currentTarget.vote_create_auth.value;
        let _userNameType = e.currentTarget.user_name_type.value;
        let room = {
            title:_title,
            url_name: _urlName,
            poll_create_auth: _voteCreateAuth,
            user_name_type: _userNameType
        }
        this.props.onRoomCreate(room);
    }

    render(){
        return(
            <>
            <Button variant="light" className="float-right" onClick={this.handleShow}>
                <span>
                    <i className="fas fa-plus"></i>
                </span>
            </Button>
            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Make Room</Modal.Title>
                </Modal.Header>
                <Form onSubmit={this.onRoomCreate}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Room Name</Form.Label>
                            <Form.Control name="title" type="text" placeholder="방 이름을 입력하세요." required/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>URL</Form.Label>
                            <Form.Control name="url_name" type="text" placeholder="URL을 입력하세요."/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Simpoll 생성 권한</Form.Label>
                            <Form.Check 
                                type="radio" 
                                name="vote_create_auth" 
                                value='0' 
                                label="방장만"
                                checked={this.state.authType === "0"}
                                onChange={this.onChangeVoteCreateAuth}/>
                            <Form.Check 
                                inline
                                type="radio" 
                                name="vote_create_auth" 
                                value='1' 
                                label="방 참여자 모두"
                                checked={this.state.authType === "1"}
                                onChange={this.onChangeVoteCreateAuth}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>참여자 실명/닉네임 여부</Form.Label>
                            <Form.Check 
                                type="radio" 
                                name="user_name_type" 
                                value='0' 
                                label="실명"
                                checked={this.state.nameType === "0"}
                                onChange={this.onChangeUserNameType}/>
                            <Form.Check 
                                inline
                                type="radio" 
                                name="user_name_type" 
                                value='1'
                                label="닉네임" 
                                checked={this.state.nameType === "1"}
                                onChange={this.onChangeUserNameType}/>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                        <Button variant="primary" type="submit">Submit</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            </>
        );
    }
}

export default RoomModal;
