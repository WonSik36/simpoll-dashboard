import React from 'react';
import {Button, Collapse, Card, Container, Row, Col, ButtonGroup, Form, Badge} from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import './style/Vote.css';
import BackgroundColorPreset from './json/chart';
import VoteResultProgress from './VoteResultProgress';

class VoteResultAudience extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            open: false,
            choice: 1,
            page: 1
        };
        this.setOpen = this.setOpen.bind(this);
        this.onChoiceChange = this.onChoiceChange.bind(this);
        this.disableLeftButton = this.disableLeftButton.bind(this);
        this.disableRightButton = this.disableRightButton.bind(this);
        this.onUpdateChoice = this.onUpdateChoice.bind(this);
    }

    setOpen(_open){
        this.setState({
            open: _open
        })
    }

    onChoiceChange(e){
        this.setState({
            choice: e.currentTarget.value
        });
    }

    disableLeftButton(){
        if(this.state.page == 1)
            return true;
        else
            return false;
    }

    disableRightButton(){
        if(this.state.page == 2)
            return true;
        else
            return false;
    }

    onUpdateChoice(e){
        e.preventDefault();
        let choiceId = e.currentTarget.choice_id.value;
        let contentsNumber = e.currentTarget.choice_no.value;
        let idx = this.props.idx;
        this.props.onUpdateChoice(choiceId, contentsNumber, idx);
    }

    render() {
        if(this.props.data.result === undefined){
            return null;
        }

        this.state.choice = this.props.data.result.choice_no;

        let _arrow;
        if(this.state.open)
            _arrow =<span className="icon-arrow">
                    <i className="fas fa-chevron-up"></i>
                    </span>; 
        else
            _arrow =<span className="icon-arrow">
                    <i className="fas fa-chevron-down"></i>
                    </span>;

        let _mark = <i className="far fa-clock"></i>;
        if(this.props.data.voted)
            _mark = <i className="far fa-check-circle"></i>;

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
                let _choices = [];
                let _choiceList = this.props.data.choices.split('|')
                for(let i=0;i<_choiceList.length;i++){
                    _choices.push(
                        <Form.Check 
                            key={(i+1)}
                            label={_choiceList[i]} 
                            type='radio' 
                            id={'vote-'+this.props.data.sid+'-radio-'+(i+1)} 
                            name="contents_number" value={(i+1)}
                            onChange={this.onChoiceChange}
                            checked={this.state.choice == (i+1)}
                            disabled={this.props.data.isDeadlinePass}/>
                    )
                }

                let _badge = null;
                if(this.props.data.isDeadlinePass)
                    _badge = <Badge variant="danger">마감</Badge>;
                _content = <>
                    <div className="p-2">
                        <h4 className="inline p-1">선택지 수정</h4>
                        {_badge}
                    </div>
                    <Form onSubmit={this.onUpdateChoice} className="p-2">
                        <Form.Group>
                            {_choices}
                        </Form.Group>
                        <input type="hidden" name="choice_id" value={this.props.data.result.sid}/>
                        <input type="hidden" name="idx" value={(this.props.idx)}/>
                        <Button 
                            className="float-right" 
                            variant="success" 
                            type="submit" 
                            disabled={this.props.data.isDeadlinePass}>Update!</Button>
                    </Form>
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
                                <span className="icon-checked">
                                    {_mark}
                                </span>
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

export default VoteResultAudience;