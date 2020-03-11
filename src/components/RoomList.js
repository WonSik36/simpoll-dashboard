import React from 'react';
import {Spinner, Nav} from 'react-bootstrap';
import Room from './Room';

class RoomList extends React.Component {
    constructor(props){
        super(props);
        this.onRoomClick = this.onRoomClick.bind(this);
    }

    shouldComponentUpdate(newProps, newState){
        if(newProps.data === this.props.data)
            return false;
        else
            return true;
    }

    onRoomClick(e){
        e.preventDefault();
        this.props.onRoomClick(e.currentTarget.dataset.sid);
    }

    render() {
        let _contents = [];
        if(this.props.data.isLoading){
            _contents = <Spinner animation="border" variant="primary"/>;
        }else{
            let roomList = this.props.data.items;
            for(let i=0;i<roomList.length;i++){
                _contents.push(
                    <Nav.Link 
                        key={(i+1)} href={"#room-link"+(i+1)}
                        onClick={this.onRoomClick}
                        data-sid={this.props.data.items[i].sid}>
                            <Room data={this.props.data.items[i]} key={(i+1)}/>
                    </Nav.Link>
                );
            }
        }

        return (
            <Nav className="flex-column" variant="pills" defaultActiveKey="#room-link1">
                {_contents}
            </Nav>
        )
    }   
}

export default RoomList;