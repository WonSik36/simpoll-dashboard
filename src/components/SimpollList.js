import React from 'react';
import {Spinner} from 'react-bootstrap';
import SimpollResultAudience from './SimpollResultAudience';
import SimpollResultSpeaker from './SimpollResultSpeaker';
import SimpollChoice from './SimpollChoice';

class SimpollList extends React.Component {
    render() {
        let _contents = [];

        if(this.props.data.isLoading){
            _contents = <Spinner animation="border" variant="primary"/>;
        }else{
            let _simpollList = this.props.data.items;
            if(!this.props.isAudience){
                for(let i=0;i<_simpollList.length;i++){
                    _contents.push(
                        <SimpollResultSpeaker 
                            data={_simpollList[i]} 
                            key={(i+1)} idx={i} 
                            onSimpollDelete={this.props.onSimpollDelete}
                            onSimpollRefresh={this.props.onSimpollRefresh}/>
                    ) 
                }
            }else{
                for(let i=0;i<_simpollList.length;i++){
                    if(_simpollList[i].voted || _simpollList[i].isDeadlinePass){
                        _contents.push(
                            <SimpollResultAudience 
                                data={_simpollList[i]} 
                                key={(i+1)} idx={i} 
                                onSimpollRefresh={this.props.onSimpollRefresh}/>
                        ) 
                    }else{
                        _contents.push(
                            <SimpollChoice data={_simpollList[i]} key={(i+1)} idx={i} onSimpollSubmit={this.props.onSimpollSubmit}/>
                        ) 
                    }
                }
            }
        }

        return (
            <>
                {_contents}
            </>
        )
    }   
}

export default SimpollList;