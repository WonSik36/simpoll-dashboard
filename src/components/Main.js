import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import VoteList from './VoteList';
import RoomList from './RoomList';
import './style/Main.css';

class Main extends React.Component {
    render() {
        console.log("Main is updated");

        return (
            <Container className="main-container">
                <Row>
                    <Col sm={4}>
                        <h3>Room</h3>
                        <RoomList 
                            data={this.props['room-list-data']} 
                            onRoomClick={this.props.onRoomClick}/>
                    </Col>
                    <Col sm={8}>
                        <h3>Simpoll</h3>
                        <VoteList 
                            data={this.props['vote-list-data']} 
                            onVoteSubmit={this.props['onVoteSubmit']}/>
                    </Col>
                </Row>
            </Container>
        )
    }   
}

export default Main;