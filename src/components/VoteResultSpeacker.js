import React from 'react';
import {Button, Collapse, Card, Container, Row, Col, ButtonGroup, Table, Alert} from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import './style/Vote.css';
import BackgroundColorPreset from './json/chart';
import VoteResultProgress from './VoteResultProgress';

class VoteResultSpeacker extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            open: false,
            choice: 1,
            page: 1
        };
        this.setOpen = this.setOpen.bind(this);
        this.disableLeftButton = this.disableLeftButton.bind(this);
        this.disableRightButton = this.disableRightButton.bind(this);
        this.onVoteDelete = this.onVoteDelete.bind(this);
    }

    setOpen(_open){
        this.setState({
            open: _open
        })
    }

    disableLeftButton(){
        if(this.state.page == 1)
            return true;
        else
            return false;
    }

    disableRightButton(){
        if(this.state.page == 3)
            return true;
        else
            return false;
    }

    onVoteDelete(e){
        e.preventDefault();
        this.props.onVoteDelete(this.props.data.sid);
    }

    render() {
        if(this.props.data.result === undefined){
            return null;
        }

        let _arrow;
        if(this.state.open)
            _arrow =<span className="icon-arrow">
                    <i className="fas fa-chevron-up"></i>
                    </span>; 
        else
            _arrow =<span className="icon-arrow">
                    <i className="fas fa-chevron-down"></i>
                    </span>;

        let _mark = null;
        if(this.props.data.isDeadlinePass)
            _mark = <span className="icon-checked">
                        <i className="far fa-clock"></i>
                    </span>;

        let _content = null;
        switch(this.state.page){
            case 1:
                let _data = {
                    datasets:[{
                        backgroundColor: BackgroundColorPreset,
                        data: this.props.data.result.data
                    }],
                    labels: this.props.data.result.label
                }

                _content = <Doughnut 
                    data={_data} 
                    width={100}
                    height={50}/>;
                break;

            case 2:
                let _choices=[];
                
                for(let i=0;i<this.props.data.result.participant.length;i++){
                    let str = "";
                    for(let j=0;j<this.props.data.result.participant[i].length;j++){
                        str += this.props.data.result.participant[i][j]
                        if(j != this.props.data.result.participant[i].length-1)
                            str += ", ";
                    }
                    _choices.push(
                        <tr key={(i+1)}>
                            <td key="1">{this.props.data.result.label[i]}</td>
                            <td key="2">{this.props.data.result.data[i]} 명</td>
                            <td key="3">{str}</td>
                        </tr>
                    );
                }

                _content = <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Choice</th>
                                    <th>Number</th>
                                    <th>Person</th>
                                </tr>
                            </thead>
                            <tbody>
                                {_choices}
                            </tbody>
                            </Table>;
                break;
            case 3:
                _content = <><br/><br/>
                <Alert variant="danger">
                <Alert.Heading>정말로 Simpoll을 삭제하시겠습니까?</Alert.Heading>
                <p>삭제시 복구가 불가능합니다.</p>
                <hr />
                <div className="d-flex justify-content-end">
                  <Button onClick={this.onVoteDelete} variant="outline-danger">
                    Delete
                  </Button>
                </div>
                </Alert>
                </>
        }

        let isDisableLeftButton = this.disableLeftButton();
        let isDisableRightButton = this.disableRightButton();
        return (

            <Card>
                <Card.Header className="p-1">
                    <Container>
                        <Row>
                            <Col xs={1}>
                                {_mark}
                                
                            </Col>
                            <Col xs={10} className="p-0">
                                <Row>
                                    <Col xs={12} md={6}>제목: {this.props.data.title}</Col>
                                    <Col xs={12} md={6}>마감기한: {this.props.data.deadline}</Col>
                                    <Col xs={12}>
                                        <VoteResultProgress data={this.props.data.result}/>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={1}>
                                <Button 
                                    variant="light" className="p-0 float-right"
                                    onClick={() => this.setOpen(!this.state.open)}
                                    aria-controls={"collapse-vote-"+this.props.idx}
                                    aria-expanded={this.state.open}
                                >
                                    {_arrow}
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </Card.Header>
                <Card.Body>
                    <Collapse in={this.state.open}>
                        <div id={"collapse-vote-"+this.props.idx}>
                            <ButtonGroup className="float-right">
                                <Button 
                                    variant="light" 
                                    disabled={isDisableLeftButton} 
                                    onClick={function(){this.setState({page: (this.state.page-1)})}.bind(this)}>
                                    <span>
                                        <i className="fas fa-chevron-left"></i>
                                    </span>
                                </Button>
                                <Button 
                                    variant="light" 
                                    disabled={isDisableRightButton} 
                                    onClick={function(){this.setState({page: (this.state.page+1)})}.bind(this)}>
                                    <span>
                                        <i className="fas fa-chevron-right"></i>
                                    </span>
                                </Button>
                            </ButtonGroup>
                            {_content}
                        </div>
                    </Collapse>
                </Card.Body>
            </Card>
        )
    }   
}

export default VoteResultSpeacker;