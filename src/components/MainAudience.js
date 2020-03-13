import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import VoteList from './VoteList';
import RoomList from './RoomList';
import './style/Main.css';

class MainAudience extends React.Component {
    render() {
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
                            onVoteSubmit={this.props['onVoteSubmit']}
                            isAudience={true}
                        />
                    </Col>
                </Row>
            </Container>
        )
    }   
}

export default MainAudience;