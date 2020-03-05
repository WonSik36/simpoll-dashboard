import React from 'react';
import {Button, Collapse, ProgressBar, Form} from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import './Vote.css';

class Vote extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            open: false,
            choice: 1
        };
        this.setOpen = this.setOpen.bind(this);
        this.onChoiceChange = this.onChoiceChange.bind(this);
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

    render() {
        let _contents = null;
        let _progressBar = null;

        if(this.props.done){
            let _data = {
                datasets:[{
                    backgroundColor:['#FF6384','#36A2EB','#FFCE56'],
                    data: [35,20,45]
                }],
                labels:['Choice1', 'Choice2', 'Choice3']
            }
            _contents = <Doughnut data={_data} />;
            
            _progressBar = <ProgressBar>
                    <ProgressBar striped variant="success" now={35} key={1} />
                    <ProgressBar variant="warning" now={20} key={2} />
                    <ProgressBar striped variant="danger" now={45} key={3} />
                    </ProgressBar>
        }else{
            _contents = <Form>
                <Form.Group>
                <Form.Check label="선택지 1" type='radio' id={'vote-'+this.props.sid+'-radio-1'} 
                        name="choice" value="1"
                        onChange={this.onChoiceChange}
                        checked={this.state.choice === 1}/>
                <Form.Check label="선택지 2" type='radio' id={'vote-'+this.props.sid+'-radio-2'} 
                        name="choice" value="2"
                        onChange={this.onChoiceChange}
                        checked={this.state.choice === 2}/>
                <Form.Check label="선택지 3" type='radio' id={'vote-'+this.props.sid+'-radio-3'} 
                        name="choice" value="3"
                        onChange={this.onChoiceChange}
                        checked={this.state.choice === 3}/>
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