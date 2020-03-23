import React from 'react';
import {Spinner,Row,Card,Alert} from 'react-bootstrap';
import VoteList from './VoteList';

class GroupList extends React.Component {
    render() {
        let _contents = [];
        let _group_id = [];
            let _voteList = this.props.data.items;
            for(let i=0;i<_voteList.length;i++){
                if(_voteList[i].group_id!=_voteList[i].group_id) _group_id.push(_voteList[i].group_id);
            }

            for(let i=0;i<_group_id.length;i++){
                _contents.push(
                    <Card>
                        <Card.Header>{_group_id[i]}</Card.Header>
                        <Card.Body>
                        <Alert variant='danger'>
                        <VoteList
                            data={this.props['vote-list-data']}
                            onVoteSubmit={this.props['onVoteSubmit']}
                            isAudience={true}
                            onUpdateChoice={this.props.onUpdateChoice}
                        />
                        </Alert>
                        </Card.Body>
                    </Card>
                )
            }






        return (
            <>
                {_contents}
            </>
        )
    }
}

export default GroupList;
