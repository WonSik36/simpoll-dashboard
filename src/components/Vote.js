import React from 'react';
import {Button, Collapse, ProgressBar, Form, Spinner} from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import './style/Vote.css';
import BackgroundColorPreset from './json/chart';

class Vote extends React.Component {
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

    shouldComponentUpdate(newProps, newState){
        if(newProps.data === this.props.data && newState === this.state)
            return false;
        else
            return true;
    }

    setOpen(_open){
        this.setState({
            open: _open
        })
    }

    onChoiceChange(e){
        this.setState({
            choice: e.target.value
        });
    }

    onVoteSubmit(e){
        e.preventDefault();
        let choice = e.currentTarget.choice.value;
        this.props.onVoteSubmit(this.props.data.sid, choice);
    }

    render() {
        let _contents = null;
        let _progressBar = null;

        if(this.props.done){
            let _data = {
                datasets:[{
                    backgroundColor: BackgroundColorPreset,
                    data: [35,20,45]    /* need to be updated */
                }],
                labels:['Choice1', 'Choice2', 'Choice3'] /* need to be updated */
            }
            _contents = <Doughnut data={_data} />;
            
            _progressBar = <ProgressBar>
                    <ProgressBar striped variant="success" now={35} key={1} />
                    <ProgressBar variant="warning" now={20} key={2} />
                    <ProgressBar striped variant="danger" now={45} key={3} />
                    </ProgressBar>
        }else{
            let _choices = [];
            let _choiceList = this.props.data.contents.split('|')
            for(let i=0;i<_choiceList.length;i++){
                _choices.push(
                    <Form.Check 
                        key={(i+1)}
                        label={_choiceList[i]} 
                        type='radio' 
                        id={'vote-'+this.props.data.sid+'-radio-1'} 
                        name="choice" value={(i+1)}
                        onChange={this.onChoiceChange}
                        checked={this.state.choice === (i+1)}/>
                )
            }
            _contents = <Form onSubmit={this.onVoteSubmit}>
                <Form.Group>
                {_choices}
                </Form.Group>
                <Button variant="success" type="submit">Submit!</Button>
                </Form>;
        }

        return (
            <div className="vote-container">
                <h5>투표 제목</h5>
                {_progressBar}
                <Button
                    variant='light'
                    onClick={() => this.setOpen(!this.state.open)}
                    aria-controls={"collapse-vote-"+this.props.sid}
                    aria-expanded={this.state.open}
                >V</Button>
                <Collapse in={this.state.open}>
                    <div id={"collapse-vote-"+this.props.sid}>
                        {_contents}
                    </div>
                </Collapse>
            </div>
        )
    }   
}

export default Vote;