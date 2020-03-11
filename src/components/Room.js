import React from 'react';

class Room extends React.Component {
    render() {
        return ( 
            <>
                <h4>{this.props.data.title}</h4>
                <h5>방장: {this.props.data.master_nickname}</h5>
                <h5>참여인원: {this.props.data.part_num}명</h5>
            </>
        )
    }   
}

export default Room;