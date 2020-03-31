import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import SimpollList from './SimpollList';
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
                        <SimpollList
                            data={this.props['simpoll-list-data']}
                            onSimpollSubmit={this.props['onSimpollSubmit']}
                            isAudience={true}
                            onSimpollRefresh={this.props.onSimpollRefresh}
                        />
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default MainAudience;
