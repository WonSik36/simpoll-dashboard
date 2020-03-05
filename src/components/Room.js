import React from 'react';

class Room extends React.Component {
    render() {
        return (
            <div>
                <h4>{this.props.title}</h4>
                <h5>방장: {this.props.master}</h5>
                <h5>참여인원: {this.props.part_num}명</h5>
            </div>    
        )
    }   
}

export default Room;