import React, { Component,Fragment } from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import ModalDialog from 'react-bootstrap/ModalDialog';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import VoteList from './VoteList';
import RoomList from './RoomList';
import './style/Main.css';

class MainSpeacker extends React.Component {
    constructor(props,context) {
        super(props,context);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleShow_simpoll = this.handleShow_simpoll.bind(this);
        this.handleClose_simpoll = this.handleClose_simpoll.bind(this);

        this.choice_list_no = 1;
        this.state = {
            show: false,
            show_simpoll: false,
            valueZero: 0,
            valueOne: 1,
        };
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true});
    }

    handleClose_simpoll() {
        this.setState({ show_simpoll: false });
    }

    handleShow_simpoll() {
        this.setState({ show_simpoll: true});
    }

    addChoice() {
        this.choice_list_no = this.choice_list_no + 1;
    }

    render(){

        var i = 0;
        const choice_no_list = [];
        while(i < this.choice_list_no){
            choice_no_list[i] = i+1;
            i = i + 1;
        }



        const Choice_list = choice_no_list.map(
            (no) => (
                <div id="choice-list">
                    <div id={no}>
                    <input class="answer_inputForm" type="text" name={no} placeholder={no} required></input>
                        <button type="button" class="delButton attr-bnt" onClick="">
                            <i class="fas fa-minus"></i>
                        </button><br/>
                    </div>
                </div>
            )
        );


        return (
            <Container className="main-container">
                <Row>
                    <Col sm={4}>
                        <div className="m-2">
                            <h3 className="inline">Room</h3>
                            <Button variant="light" className="float-right" onClick={this.handleShow}>
                                <span>
                                    <i class="fas fa-plus"></i>
                                </span>
                            </Button>

                            {/* modal part */}
                            <Modal show={this.state.show} onHide={this.handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Make Room</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                <form action="" method="post">
                                    <div>
                                        <p>Room Name</p>
                                        <input type="text" name="title" placeholder="방 이름을 입력하세요." required></input>
                                    </div>
                                    <div><hr />
                                        <p>URL</p>
                                        <input type="text" name="url_name" placeholder="URL을 입력하세요" required></input>
                                    </div>
                                    <div><hr />
                                        <p>Simpoll 생성 권한</p>
                                        <label><input type="radio" value={this.state.valueZero} checked /> 방장만</label>
                                        <label><input type="radio" value={this.state.valueOne} /> 방 참여자 모두</label>
                                    </div>
                                    <div><hr />
                                        <p>참여자 실명/닉네임 여부</p>
                                        <label><input type="radio" value={this.state.valueZero} checked /> 실명</label>
                                        <label><input type="radio" value={this.state.valueOne} /> 닉네임</label>
                                    </div>
                                </form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <div>
                                        <Button type="submit" onClick={this.handleClose}>Submit</Button>
                                    </div>
                                    <Button variant="light" onClick={this.handleClose}>Close</Button>
                                </Modal.Footer>
                            </Modal>

                        </div>
                        <RoomList
                            data={this.props['room-list-data']}
                            onRoomClick={this.props.onRoomClick}/>
                    </Col>
                    <Col sm={8}>
                        <div className="m-2">
                            <h3 className="inline">Simpoll</h3>
                            <Button variant="light"  className="float-right" onClick={this.handleShow_simpoll}>
                                <span>
                                    <i class="fas fa-plus"></i>
                                </span>
                            </Button>

                            {/* modal part */}
                            <Modal show={this.state.show_simpoll} onHide={this.handleClose_simpoll}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Make Simpoll</Modal.Title>
                                </Modal.Header>
                                    <Modal.Body>
                                    <form action="" method="post">
                                        <div>
                                            <p>Simpoll Name</p>
                                            <input type="text" name="title" placeholder="Simpoll 이름을 입력하세요." required></input>
                                        </div>

                                        <div><hr />
                                            <p>URL</p>
                                            <input type="text" name="url_name" placeholder="URL을 입력하세요" required></input>
                                        </div>

                                        <div><hr />
                                            <p id="add_option">add option
                                                <button type="button" class="attr-btn" id="addButton" onClick={this.addChoice()}>
                                                <i class="fas fa-plus"></i>
                                                </button>
                                            </p>
                                        </div>

                                        {Choice_list}

                                        <div><hr />
                                            <table>

                                                <tr>
                                                    <td class="align-left">익명 투표</td>
                                                    <td><input id="anonymous_check" type="checkbox" name="anonymous_check" value={this.state.valueOne}></input></td>
                                                </tr>

                                                <tr>
                                                    <td class="align-left">복수 선택</td>
                                                    <td><input type="checkbox" name="vote_type" value={this.state.valueOne}></input></td>
                                                </tr>
                                        </table>
                                        </div>

                                        <div><hr />
                                            <p>참여 권한</p>
                                            <label><input type="radio" value={this.state.valueZero} checked /> 로그인 한 누구나</label>
                                            <label><input type="radio" value={this.state.valueOne} /> 링크를 가진 누구나</label>
                                        </div>

                                        <div><hr />
                                            <p id="add_option">마감시간</p>
                                            <input type="date" name="vote_end_date" value="vote_end_date" required></input>
                                            <input type="time" name="vote_end_time" value="vote_end_time" required></input>
                                        </div>
                                    </form>
                                    </Modal.Body>
                                <Modal.Footer>
                                    <div>
                                        <Button type="submit" onClick={this.handleClose_simpoll}>Submit</Button>
                                    </div>
                                    <Button variant="light" onClick={this.handleClose_simpoll}>Close</Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                        <VoteList
                            data={this.props['vote-list-data']}
                            onVoteSubmit={this.props['onVoteSubmit']}
                            isAudience={false}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }

}

export default MainSpeacker;
