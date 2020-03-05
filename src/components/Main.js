import React from 'react';
import {Container, Tab, ListGroup, Row, Col, Spinner} from 'react-bootstrap';
import Vote from './Vote';
import Room from './Room';
import './Main.css';

class Main extends React.Component {
    render() {
        let _listGroupContent = [];
        if(this.props['room-list-data'].isLoading){
            _listGroupContent = <Spinner animation="border" variant="primary"/>;
        }else{
            let roomList = this.props['room-list-data'].items;
            console.log(roomList);
            for(let i=0;i<roomList.length;i++){
                _listGroupContent.push(<ListGroup.Item action href={"#link"+(i+1)}>
                    <Room title={roomList[i].title} master={roomList[i].master} part_num={roomList[i].part_num}/>
                </ListGroup.Item>);
            }
        }


        return (
            <Container className="main-container">
                <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
                    <Row>
                        <Col sm={4}>
                        <h3>Room</h3>
                        <ListGroup>
                            {_listGroupContent}
                        </ListGroup>
                        </Col>
                        <Col sm={8}>
                        <h3>Simpoll</h3>
                        <Tab.Content>
                            <Tab.Pane eventKey="#link1">
                            <Vote done={true}/>
                            <Vote done={false}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="#link2">
                            </Tab.Pane>
                        </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Container>
        )
    }   
}

export default Main;