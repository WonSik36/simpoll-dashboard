import React from 'react';
import {Button, Collapse, Card, Container, Row, Col} from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import './style/Vote.css';
import BackgroundColorPreset from './json/chart';
import VoteResultProgress from './VoteResultProgress';

class VoteResult extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            open: false,
            choice: 1
        };
        this.setOpen = this.setOpen.bind(this);
    }

    setOpen(_open){
        this.setState({
            open: _open
        })
    }

    render() {
        if(this.props.data.result === undefined){
            return null;
        }

        let _data = {
            datasets:[{
                backgroundColor: BackgroundColorPreset,
                data: this.props.data.result.data
            }],
            labels: this.props.data.result.label
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
                            <Col xs={1}>
                                <span className="icon-checked">
                                    <i className="far fa-check-circle"></i>
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
                            <Doughnut 
                                data={_data} 
                                width={100}
                                height={50}/>
                        </div>
                    </Collapse>
                </Card.Body>
            </Card>
        )
    }   
}

export default VoteResult;