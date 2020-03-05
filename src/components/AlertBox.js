import React from 'react';
import {Card, Alert} from 'react-bootstrap';

class AlertBox extends React.Component {
    render() {
        return (
            <Card>
                <Card.Header>알림</Card.Header>
                <Card.Body>
                <Alert variant='danger'>
                    <Alert.Heading>공지</Alert.Heading>
                    알림 기능은 추후 개발될 예정입니다ㅠ
                </Alert>
                </Card.Body>
            </Card>
        )
    }   
}

export default AlertBox;