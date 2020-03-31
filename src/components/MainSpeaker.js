import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import SimpollList from './SimpollList';
import RoomList from './RoomList';
import RoomModal from './RoomModal';
import SimpollModal from './SimpollModal';
import './style/Main.css';

class MainSpeaker extends React.Component {
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
                            <SimpollModal onSimpollCreate={this.props.onSimpollCreate} currentRoomId={this.props.currentRoomId}/>
                        </div>
                        <SimpollList
                            data={this.props['simpoll-list-data']}
                            onSimpollSubmit={this.props['onSimpollSubmit']}
                            isAudience={false}
                            onSimpollDelete={this.props.onSimpollDelete}
                            onSimpollRefresh={this.props.onSimpollRefresh}/>
                    </Col>
                </Row>
            </Container>
        );
    }

}

export default MainSpeaker;
