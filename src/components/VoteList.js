import React from 'react';
import {Spinner} from 'react-bootstrap';
import Vote from './Vote';

class VoteList extends React.Component {
    render() {
        let _contents = [];

        if(this.props.data.isLoading){
            _contents = <Spinner animation="border" variant="primary"/>;
        }else{
            let _voteList = this.props.data.items;
            for(let i=0;i<_voteList.length;i++){
                _contents.push(
                    <Vote data={_voteList[i]} key={(i+1)} onVoteSubmit={this.onVoteSubmit}/>
                ) 
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