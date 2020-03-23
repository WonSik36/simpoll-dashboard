import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import GroupList from './GroupList';
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
                            onRoomClick={this.props.onRoomClick}
                            isAudience={true}/>
                    </Col>
                    <Col sm={8}>
                        <h3>Simpoll</h3>
                        <GroupList
                            data={this.props['vote-list-data']}
                            onVoteSubmit={this.props['onVoteSubmit']}
                            isAudience={true}
                            onUpdateChoice={this.props.onUpdateChoice}
                        />
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default MainAudience;
