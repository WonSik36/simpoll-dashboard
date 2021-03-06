import React from 'react';
import {ButtonToolbar, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';
import './style/ModeButton.css';

class ModeButton extends React.Component {
    constructor(props){
        super(props);
        this.onViewModeChange = this.onViewModeChange.bind(this);
    }

    onViewModeChange(e){
        e.preventDefault();
        if(e.currentTarget.dataset.persontype === "audience"){
            this.props.onViewModeChange(true);
        }else{
            this.props.onViewModeChange(false);
        }
    }

    render(){
        let _audienceVariant, _speackerVariant;

        if(this.props.viewmode === "audience"){
            _audienceVariant = "primary";
            _speackerVariant = "light";
        }else{
            _audienceVariant = "light";
            _speackerVariant = "primary";
        }
        return (
            <ButtonToolbar>
                <ToggleButtonGroup type="radio" name="options">
                    <ToggleButton className="button" variant={_audienceVariant} data-persontype="audience" onClick={this.onViewModeChange}>참여중인 Simpoll</ToggleButton>
                    <ToggleButton className="button" variant={_speackerVariant} data-persontype="speaker" onClick={this.onViewModeChange}>개설한 Simpoll</ToggleButton>
                </ToggleButtonGroup>
            </ButtonToolbar>
        )
    }
}

export default ModeButton;