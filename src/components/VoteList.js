import React from 'react';
import {Spinner} from 'react-bootstrap';
import VoteResultAudience from './VoteResultAudience';
import VoteResultSpeacker from './VoteResultSpeacker';
import VoteChoice from './VoteChoice';

class VoteList extends React.Component {
    render() {
        let _contents = [];

        if(this.props.data.isLoading){
            _contents = <Spinner animation="border" variant="primary"/>;
        }else{
            let _voteList = this.props.data.items;
            if(!this.props.isAudience){
                for(let i=0;i<_voteList.length;i++){
                    _contents.push(
                        <VoteResultSpeacker 
                            data={_voteList[i]} 
                            key={(i+1)} idx={i} 
                            onVoteDelete={this.props.onVoteDelete}
                            onVoteRefresh={this.props.onVoteRefresh}/>
                    ) 
                }
            }else{
                for(let i=0;i<_voteList.length;i++){
                    if(_voteList[i].voted || _voteList[i].isDeadlinePass){
                        _contents.push(
                            <VoteResultAudience 
                                data={_voteList[i]} 
                                key={(i+1)} idx={i} 
                                onUpdateChoice={this.props.onUpdateChoice}
                                onVoteRefresh={this.props.onVoteRefresh}/>
                        ) 
                    }else{
                        _contents.push(
                            <VoteChoice data={_voteList[i]} key={(i+1)} idx={i} onVoteSubmit={this.props.onVoteSubmit}/>
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

export default VoteList;