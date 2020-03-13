import React from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
import VoteList from './VoteList';
import RoomList from './RoomList';
import './style/Main.css';

class MainSpeacker extends React.Component {
    render() {
        return (
            <Container className="main-container">
                <Row>
                    <Col sm={4}>
                        <div className="m-2">
                            <h3 className="inline">Room</h3>
                            <Button variant="light" className="float-right">
                                <span>
                                    <i class="fas fa-plus"></i>
                                </span>
                            </Button>
                        </div>
                        <RoomList 
                            data={this.props['room-list-data']} 
                            onRoomClick={this.props.onRoomClick}/>
                    </Col>
                    <Col sm={8}>
                        <div className="m-2">
                            <h3 className="inline">Simpoll</h3>
                            <Button variant="light"  className="float-right">
                                <span>
                                    <i class="fas fa-plus"></i>
                                </span>
                            </Button>
                        </div>
                        <VoteList 
                            data={this.props['vote-list-data']} 
                            onVoteSubmit={this.props['onVoteSubmit']}
                            isAudience={false}
                        />
                    </Col>
                </Row>
            </Container>
        )
    }   
}

export default MainSpeacker;