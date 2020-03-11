import React from 'react';
import {Button, Collapse, Form} from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import './style/Vote.css';
import BackgroundColorPreset from './json/chart';
import VoteResultProgress from './VoteResultProgress';

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

    // shouldComponentUpdate(newProps, newState){
    //     if(newProps.data === this.props.data && newState === this.state)
    //         return false;
    //     else
    //         return true;
    // }

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
        console.log("vote");
        console.log(this.props.data);
        let _contents = null;

        if(this.props.data.voted){
            let _data = {
                datasets:[{
                    backgroundColor: BackgroundColorPreset,
                    data: this.props.data.data
                }],
                labels: this.props.data.label
            }
            _contents = <Doughnut data={_data} />;
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
                        name="contents_number" value={(i+1)}
                        onChange={this.onChoiceChange}
                        checked={this.state.choice == (i+1)}/>
                )
            }
            _contents = <Form onSubmit={this.onVoteSubmit}>
                <Form.Group>
                {_choices}
                </Form.Group>
                <input type="hidden" name="vote_id" value={this.props.data.sid}/>
                <input type="hidden" name="idx" value={(this.props.idx)}/>
                <Button variant="success" type="submit">Submit!</Button>
                </Form>;
        }

        return (
            <div className="vote-container">
                <h5>{this.props.data.title}</h5>
                <VoteResultProgress data={this.props.data}/>
                <Button
                    variant='light'
                    onClick={() => this.setOpen(!this.state.open)}
                    aria-controls={"collapse-vote-"+this.props.data.sid}
                    aria-expanded={this.state.open}
                >V</Button>
                <Collapse in={this.state.open}>
                    <div id={"collapse-vote-"+this.props.data.sid}>
                        {_contents}
                    </div>
                </Collapse>
            </div>
        )
    }   
}

export default Vote;