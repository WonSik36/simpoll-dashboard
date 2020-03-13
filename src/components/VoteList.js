import React from 'react';
import {Spinner} from 'react-bootstrap';
import VoteResult from './VoteResult';
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
                        <VoteResult data={_voteList[i]} key={(i+1)} idx={i}/>
                    ) 
                }
            }else{
                for(let i=0;i<_voteList.length;i++){
                    if(_voteList[i].voted){
                        _contents.push(
                            <VoteResult data={_voteList[i]} key={(i+1)} idx={i}/>
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