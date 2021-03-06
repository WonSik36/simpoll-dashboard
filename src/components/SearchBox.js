import React from 'react';
import {Card, Form, Button, Spinner} from 'react-bootstrap';
import './style/SearchBox.css';

class SearchBox extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            searchType : 'room',
            placeholder : 'room을 입력하세요.'
        }
        this.onSearchTypeChange = this.onSearchTypeChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.onAddRoom = this.onAddRoom.bind(this);
    }

    shouldComponentUpdate(newProps, newState){
        if(newProps.data === this.props.data && newState === this.state)
            return false;
        else
            return true;
    }

    onSearchTypeChange(e){
        this.setState({
            searchType : e.target.value,
            placeholder : e.target.value+'을 입력하세요.'
        });
    }

    onSearchSubmit(e){
        e.preventDefault();
        this.props.onSubmit(e.currentTarget['search-word'].value,e.currentTarget['search-type'].value);
    }

    onAddRoom(e){
        e.preventDefault();    
        this.props.addRoom(this.props.data.item.sid);
    }

    render() {
        let _content = null;
        if(this.props.data.item.title!==null){
            if(this.state.searchType === 'room'){
                _content = <div className="search-box-content">
                                <b>{this.props.data.item.title}</b><br/>
                                <b>방장:</b> {this.props.data.item.master_nickname}<br/>
                                <b>참여인원:</b> {this.props.data.item.part_num}<br/>
                            <Button onClick={this.onAddRoom}>Room 참여</Button>
                        </div>;
            }else{
                _content = <div className="search-box-content">
                                <b>{this.props.data.item.title}</b><br/>
                                <b>개설자:</b> {this.props.data.item.user_nickname}<br/>
                            <Button href="#">Simpoll 참여</Button>
                        </div>;
            }
        }

        if(this.props.data.isLoading){
            _content = <Spinner animation="border" variant="primary"/>;
        }

        return (
            <Card>
                <Card.Header>검색</Card.Header>
                <Card.Body>
                    <Form onSubmit={this.onSearchSubmit}>
                        <Form.Control required type="text" placeholder={this.state.placeholder} name="search-word"/>
                        <Form.Group className="p-1">
                            <Form.Check inline label="Room" type='radio' id='radio-1' 
                                name="search-type" value="room"
                                onChange={this.onSearchTypeChange}
                                checked={this.state.searchType === 'room'}/>
                            <Form.Check inline label="Simpoll" type='radio' id='radio-2' 
                                name="search-type" value="simpoll"
                                onChange={this.onSearchTypeChange}
                                checked={this.state.searchType === 'simpoll'}/>
                            <Button variant="primary" type="submit">
                                Search!
                            </Button>
                        </Form.Group>
                    </Form>
                        {_content}
                </Card.Body>
            </Card>
        )
    }   
}

export default SearchBox;