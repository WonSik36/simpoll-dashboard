import React from 'react';
import {ButtonToolbar, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';

class ModeButton extends React.Component {

    render(){
        let _audienceVariant, _speackerVariant;

        if(this.props.personType == "audience"){
            _audienceVariant = "primary";
            _speackerVariant = "light";
        }else{
            _audienceVariant = "light";
            _speackerVariant = "primary";
        }
        return (
            <ButtonToolbar>
                <ToggleButtonGroup type="radio" name="options">
                    <ToggleButton variant={_audienceVariant} data-persontype="audience" onClick={this.props.onPersonTypeChange}>참여중인 Simpoll</ToggleButton>
                    <ToggleButton variant={_speackerVariant} data-persontype="speacker" onClick={this.props.onPersonTypeChange}>개설한 Simpoll</ToggleButton>
                </ToggleButtonGroup>
            </ButtonToolbar>
        )
    }
}

export default ModeButton;