import React from 'react';
import {Button, Collapse, Card, Container, Row, Col, ButtonGroup, Form, FormGroup} from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import './style/Simpoll.css';
import BackgroundColorPreset from './json/chart';

class SimpollResultAudience extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            open: false,
            page: 1
        };
        this.setOpen = this.setOpen.bind(this);
        this.disableLeftButton = this.disableLeftButton.bind(this);
        this.disableRightButton = this.disableRightButton.bind(this);
        this.onSimpollRefresh = this.onSimpollRefresh.bind(this);
    }

    setOpen(_open){
        this.setState({
            open: _open
        })
    }

    disableLeftButton(){
        if(this.state.page === 1)
            return true;
        else
            return false;
    }

    disableRightButton(){
        if(this.state.page === 2)
            return true;
        else
            return false;
    }

    onSimpollRefresh(e){
        e.preventDefault();
        this.props.onSimpollRefresh(this.props.idx);
    }

    render() {
        let _arrow;
        let _key = 1;

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

        let _content = [];
        switch(this.state.page){
            case 1:
                for(let i=0;i<this.props.data.questions.length;i++){
                    let _count = [];
                    let _label = [];

                    for(let j=0;j<this.props.data.questions[i].options.length;j++){
                        _count[j] = this.props.data.questions[i].options[j].count;
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
                _content.push(<p key={_key++}>내 선택</p>);
                for(let j=0;j<this.props.data.questions.length;j++){
                    let _formGroup = [];
                    if(this.props.data.questions[j].question_type === "0"){
                        for(let i=0;i<this.props.data.questions[j].options.length;i++){
                            let _checked = this.props.data.questions[j].options[i].voted;

                            _formGroup.push(
                                <Form.Check 
                                    inline
                                    key={_key++}
                                    label={this.props.data.questions[j].options[i].option_name} 
                                    type='radio' 
                                    id={'simpoll-'+this.props.data.questions[j].sid+'-radio-'+(i+1)} 
                                    name={"contents_number"+this.props.data.questions[j].sid} 
                                    value={(i+1)}
                                    defaultChecked={_checked}
                                    disabled={true}/>
                            )
                        }
                    }else if(this.props.data.questions[j].question_type === "1"){
                        for(let i=0;i<this.props.data.questions[j].options.length;i++){
                            let _checked = this.props.data.questions[j].options[i].voted;
                            _formGroup.push(
                                <Form.Check 
                                    inline
                                    key={_key++}
                                    label={this.props.data.questions[j].options[i].option_name} 
                                    type='checkbox' 
                                    id={'simpoll-'+this.props.data.questions[j].sid+'-checkbox-'+(i+1)} 
                                    name={"contents_number"+this.props.data.questions[j].sid}
                                    value={(i+1)}
                                    defaultChecked={_checked}
                                    disabled={true}/>
                            )
                        }
                    }
                    _content.push(
                        <FormGroup key={_key++}>
                            <Form.Label key={_key++}>{this.props.data.questions[j].question_title}</Form.Label>
                            <br/>
                            {_formGroup}
                        </FormGroup>
                    )
                }

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
                            <Col xs={9} className="p-0">
                                <Row>
                                    <Col xs={12}>
                                        <b>제목</b>: {this.props.data.title} <b>심폴ID</b>: {this.props.data.simpoll_id} <b>URL</b>: {this.props.data.url_name}
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

export default SimpollResultAudience;