import React from 'react';
import {ProgressBar} from 'react-bootstrap';

class SimpollResultProgress extends React.Component {
    constructor(props){
        super(props);
        this.state= {
            colors : ["primary", "secondary", "success", "danger", "warning", "info"]
        };
    }

    render() {
        if(this.props.data.label === undefined){
            return null;
        }

        let sum = 0;
        for(let i=0;i<this.props.data.label.length;i++){
            sum += this.props.data.data[i];
        }
        
        let _bars = [];
        for(let i=0;i<this.props.data.label.length;i++){
            _bars.push(
                <ProgressBar animated key={(i+1)}
                    variant={this.state.colors[(i%this.state.colors.length)]} 
                    now={(this.props.data.data[i]*100/sum)} 
                    label={this.props.data.label[i]} />
                );
        }

        return (
            <ProgressBar>
                {_bars}        
            </ProgressBar>
        )
    }   
}

export default SimpollResultProgress;