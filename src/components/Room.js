import React from 'react';

class Room extends React.Component {
    render() {
        console.log("room "+this.props.title+" is updated");
        return ( 
            <>
                <h4>{this.props.data.title}</h4>
                <h5>방장: {this.props.data.master}</h5>
                <h5>참여인원: {this.props.data.part_num}명</h5>
            </>
        )
    }   
}

export default Room;