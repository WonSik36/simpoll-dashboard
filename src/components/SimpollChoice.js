import React from 'react';
import {Button, Collapse, Form, Card, Container, Row, Col, FormGroup} from 'react-bootstrap';
import './style/Simpoll.css';

class SimpollChoice extends React.Component {
    constructor(props){
        super(props);

        let _choices = [];
        for(let j=0;j<this.props.data.questions.length;j++){
            let _choice = [];
            for(let i=0;i<this.props.data.questions[j].options.length;i++){
                _choice.push(false);
            }
            _choices.push(_choice);
        }

        this.state = {
            open: false,
            choice: _choices
        };

        this.setOpen = this.setOpen.bind(this);
        this.onChoiceChange = this.onChoiceChange.bind(this);
        this.onSimpollSubmit = this.onSimpollSubmit.bind(this);
    }

    setOpen(_open){
        this.setState({
            open: _open
        })
    }

    onChoiceChange(e){
        let _choice = this.state.choice.slice();
        let qidx = e.currentTarget.dataset.qidx;
        let oidx = e.currentTarget.dataset.oidx;
        if(this.props.data.questions[qidx].question_type === "0"){
            for(let i=0;i<_choice[qidx].length;i++){
                if(i == oidx)
                    _choice[qidx][i] = true;
                else
                    _choice[qidx][i] = false;
            }
        }else{
            for(let i=0;i<_choice[qidx].length;i++){
                if(i == oidx)
                    _choice[qidx][i] = !_choice[qidx][i];
            }
        }

        this.setState({
            choice: _choice
        });
    }

    onSimpollSubmit(e){
        e.preventDefault();
        
        let options = [];
        for(let i=0;i<this.state.choice.length;i++){
            for(let j=0;j<this.state.choice[i].length;j++){
                if(this.state.choice[i][j])
                    options.push(this.props.data.questions[i].options[j].option_id);
            }
        }

        this.props.onSimpollSubmit({
            idx: this.props.idx,
            data: options
        });
    }

    render() {
        let _content = [];
        let _key = 1;

        for(let j=0;j<this.props.data.questions.length;j++){
            let _formGroup = [];

            if(this.props.data.questions[j].question_type === "0"){
                for(let i=0;i<this.props.data.questions[j].options.length;i++){
                    _formGroup.push(
                        <Form.Check 
                            inline
                            key={_key++}
                            label={this.props.data.questions[j].options[i].option_name} 
                            type='radio' 
                            data-qidx={j}
                            data-oidx={i}
                            chekced={this.state.choice[j][i].toString()}
                            onChange={this.onChoiceChange}
                            name={"option-"+this.props.data.questions[j].sid}
                            value={this.props.data.questions[j].options[i].option_id}/>
                    )
                }
            }else if(this.props.data.questions[j].question_type === "1"){
                for(let i=0;i<this.props.data.questions[j].options.length;i++){
                    _formGroup.push(
                        <Form.Check 
                            inline
                            key={_key++}
                            label={this.props.data.questions[j].options[i].option_name} 
                            type='checkbox' 
                            data-qidx={j}
                            data-oidx={i}
                            chekced={this.state.choice[j][i].toString()}
                            onChange={this.onChoiceChange}
                            name={"option-"+this.props.data.questions[j].sid}
                            value={this.props.data.questions[j].options[i].option_id}/>
                    )
                }

            }

            _content.push(
                <FormGroup key={j}>
                    <Form.Label>{this.props.data.questions[j].question_title}</Form.Label>
                    <br/>
                    {_formGroup}
                </FormGroup>
            )
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

        return (
            <Card>
                <Card.Header className="p-1">
                    <Container>
                        <Row>
                            <Col xs={1}></Col>
                            <Col xs={10} className="p-0">
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
                            <Form onSubmit={this.onSimpollSubmit}>
                                    {_content}
                                <input type="hidden" name="idx" value={(this.props.idx)}/>
                                <Button className="float-right" variant="success" type="submit">Submit!</Button>
                            </Form>
                        </div>
                    </Collapse>
                </Card.Body>
            </Card>
        )
    }   
}

export default SimpollChoice;