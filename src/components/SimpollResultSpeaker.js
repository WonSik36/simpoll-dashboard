import React from 'react';
import {Button, Collapse, Card, Container, Row, Col, ButtonGroup, Table, Alert} from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import './style/Simpoll.css';
import BackgroundColorPreset from './json/chart';
import SimpollResultProgress from './SimpollResultProgress';

class SimpollResultSpeaker extends React.Component {
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
        this.onSimpollDelete = this.onSimpollDelete.bind(this);
        this.onSimpollRefresh = this.onSimpollRefresh.bind(this);
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

    onSimpollDelete(e){
        e.preventDefault();
        this.props.onSimpollDelete(this.props.data.sid);
    }

    onSimpollRefresh(e){
        e.preventDefault();
        this.props.onSimpollRefresh(this.props.idx,false,false);
    }

    render() {
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

        let _content = [];
        switch(this.state.page){
            case 1:
                for(let i=0;i<this.props.data.questions.length;i++){
                    let _count = [];
                    let _label = [];

                    for(let j=0;j<this.props.data.questions[i].options.length;j++){
                        _count[j] = this.props.data.questions[i].options[j].option_user_id.length;
                        _label[j] = this.props.data.questions[i].options[j].option_name;
                    }

                    let _data = {
                        datasets:[{
                            backgroundColor: BackgroundColorPreset,
                            data: _count
                        }],
                        labels: _label
                    }

                    _content.push(
                        <div key={i}>
                            <p key={i}>{this.props.data.questions[i].question_title}</p>
                            <Doughnut 
                            data={_data} 
                            width={100}
                            height={50}/>
                        </div>
                    );
                }

                break;

            case 2:
                for(let j=0;j<this.props.data.questions.length;j++){
                    let _choices=[];
                    for(let i=0;i<this.props.data.questions[j].options.length;i++){
                        let str = "";
                        for(let k=0;k<this.props.data.questions[j].options[i].option_user_nickname.length;k++){
                            str += this.props.data.questions[j].options[i].option_user_nickname[k];
                            if(k !== this.props.data.questions[j].options[i].option_user_nickname.length-1)
                                str += ", ";
                        }
                        _choices.push(
                            <tr key={(i+1)}>
                                <td key="1">{this.props.data.questions[j].options[i].option_name}</td>
                                <td key="2">{this.props.data.questions[j].options[i].count} 명</td>
                                <td key="3">{str}</td>
                            </tr>
                        );
                    }

                    _content.push(<p>{this.props.data.questions[j].question_title}</p>)
                    _content.push(<Table striped bordered hover key={j}>
                                <thead>
                                    <tr>
                                        <th>Question</th>
                                        <th>Number</th>
                                        <th>Person</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {_choices}
                                </tbody>
                                </Table>);
                }
                break;
            case 3:
                _content = <><br/><br/>
                <Alert variant="danger">
                <Alert.Heading>정말로 Simpoll을 삭제하시겠습니까?</Alert.Heading>
                <p>삭제시 복구가 불가능합니다.</p>
                <hr />
                <div className="d-flex justify-content-end">
                  <Button onClick={this.onSimpollDelete} variant="outline-danger">
                    Delete
                  </Button>
                </div>
                </Alert>
                </>
                break;
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
                            <Col xs={9} className="p-0">
                                <Row>
                                    <Col xs={12}>
                                        <b>제목</b>: {this.props.data.title} <b>심폴ID</b>: {this.props.data.sid} <b>URL</b>: {this.props.data.url_name}
                                    </Col>
                                    <Col xs={12}>
                                        <b>마감기한</b>: {this.props.data.deadline}
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={1}>
                                <Button 
                                    variant="light" className="p-0 float-right"
                                    onClick={this.onSimpollRefresh}
                                >
                                    <span className="icon-refresh">
                                        <i className="fas fa-redo-alt"></i>
                                    </span>
                                </Button>
                            </Col>
                            <Col xs={1}>
                                <Button 
                                    variant="light" className="p-0 float-right"
                                    onClick={() => this.setOpen(!this.state.open)}
                                    aria-controls={"collapse-simpoll-"+this.props.idx}
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
                        <div id={"collapse-simpoll-"+this.props.idx}>
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

export default SimpollResultSpeaker;