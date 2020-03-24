import React from 'react';
import {Button, Modal} from 'react-bootstrap';

class Room extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showModal: false
        }

        this.onRoomDelete = this.onRoomDelete.bind(this);
        this.updateModal = this.updateModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    onRoomDelete(e){
        e.preventDefault();
        this.closeModal();
        this.props.onRoomDelete(this.props.data.sid);
    }

    updateModal(show){
        this.setState({showModal:show});
    }

    closeModal(){
        this.updateModal(false);
    }
    
    openModal(){
        this.updateModal(true);
    }

    render() {
        let _deleteBtn = null;
        if(!this.props.isAudience){
            _deleteBtn = <>
                <Button variant="light" className="float-right p-0" onClick={this.openModal}>
                    <span><i className="fas fa-minus"></i></span>
                </Button>
                <Modal show={this.state.showModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                    <Modal.Title>정말로 삭제하시겠습니까?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>한번 삭제하면 되돌릴 수 없습니다.</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.closeModal}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={this.onRoomDelete}>
                        Delete
                    </Button>
                    </Modal.Footer>
                </Modal>
            </>
        }

        return ( 
            <>
                {_deleteBtn}
                <h5>{this.props.data.title}</h5>
                <h6>방장: {this.props.data.master_nickname}</h6>
                <h6>참여인원: {this.props.data.part_num}명</h6>
                <h6>방 ID: {this.props.data.sid} URL: {this.props.data.url_name}</h6>
            </>
        )
    }   
}

export default Room;