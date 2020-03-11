import React from 'react';
import {Button, Collapse, Form, Card, Container, Row, Col} from 'react-bootstrap';
import './style/Vote.css';

class VoteChoice extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            open: false,
            choice: 1
        };
        this.setOpen = this.setOpen.bind(this);
        this.onChoiceChange = this.onChoiceChange.bind(this);
        this.onVoteSubmit = this.onVoteSubmit.bind(this);
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

    onVoteSubmit(e){
        e.preventDefault();
        this.props.onVoteSubmit(e);
    }

    render() {
        let _choices = [];
        let _choiceList = this.props.data.contents.split('|')
        for(let i=0;i<_choiceList.length;i++){
            _choices.push(
                <Form.Check 
                    key={(i+1)}
                    label={_choiceList[i]} 
                    type='radio' 
                    id={'vote-'+this.props.data.sid+'-radio-'+(i+1)} 
                    name="contents_number" value={(i+1)}
                    onChange={this.onChoiceChange}
                    checked={this.state.choice == (i+1)}/>
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
                                    <Col xs={12} md={6}>제목: {this.props.data.title}</Col>
                                    <Col xs={12} md={6}>마감기한: {this.props.data.deadline}</Col>
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
                            <Form onSubmit={this.onVoteSubmit}>
                                <Form.Group>
                                    {_choices}
                                </Form.Group>
                                <input type="hidden" name="vote_id" value={this.props.data.sid}/>
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

export default VoteChoice;