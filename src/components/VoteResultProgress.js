import React from 'react';
import {ProgressBar} from 'react-bootstrap';

class VoteResultProgress extends React.Component {
    constructor(props){
        super(props);
        this.state= {
            colors : ["success", "warning", "danger", "info", "primary"]
        };
    }

    render() {
        if(!this.props.data.voted){
            return null;
        }

        if(this.props.data.label == null){
            return null;
        }

        let sum = 0;
        for(let i=0;i<this.props.data.label.length;i++){
            sum += this.props.data.data[i];
        }
        
        let _bars = [];
        if(sum != 0){
            for(let i=0;i<this.props.data.label.length;i++){
                _bars.push(
                    <ProgressBar animated key={(i+1)}
                        variant={this.state.colors[(i%this.state.colors.length)]} 
                        now={(this.props.data.data[i]*100/sum)} 
                        label={this.props.data.label[i]} />
                    );
            }
        }

        return (
            <ProgressBar>
                {_bars}        
            </ProgressBar>
        )
    }   
}

export default VoteResultProgress;