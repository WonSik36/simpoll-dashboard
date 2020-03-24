import React, { Component,Fragment } from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
import VoteList from './VoteList';
import RoomList from './RoomList';
import RoomModal from './RoomModal';
import VoteModal from './VoteModal';
import './style/Main.css';

class MainSpeacker extends React.Component {
    render(){
        return (
            <Container className="main-container">
                <Row>
                    <Col sm={4}>
                        <div className="m-2">
                            <h3 className="inline">Room</h3>
                            <RoomModal onRoomCreate={this.props.onRoomCreate}/>
                        </div>
                        <RoomList
                            data={this.props['room-list-data']}
                            onRoomClick={this.props.onRoomClick}
                            isAudience={false}
                            onRoomDelete={this.props.onRoomDelete}/>
                    </Col>
                    <Col sm={8}>
                        <div className="m-2">
                            <h3 className="inline">Simpoll</h3>
                            <VoteModal onVoteCreate={this.props.onVoteCreate} currentRoomId={this.props.currentRoomId}/>
                        </div>
                        <VoteList
                            data={this.props['vote-list-data']}
                            onVoteSubmit={this.props['onVoteSubmit']}
                            isAudience={false}
                            onVoteDelete={this.props.onVoteDelete}
                            onVoteRefresh={this.props.onVoteRefresh}/>
                    </Col>
                </Row>
            </Container>
        );
    }

}

export default MainSpeacker;
