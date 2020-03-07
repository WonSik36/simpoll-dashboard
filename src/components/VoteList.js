import React from 'react';
import {Spinner} from 'react-bootstrap';
import Vote from './Vote';

class VoteList extends React.Component {
    render() {
        let _contents = [];

        if(this.props.data.isLoading){
            _contents = <Spinner animation="border" variant="primary"/>;
        }else{
            for(let i=0;i<this.props.data.items.length;i++){
                _contents.push(
                    <Vote/>
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