import React from 'react';
import {Modal, Form, Button, FormControl,InputGroup} from 'react-bootstrap';

class VoteModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
            anonymousType: '0',
            anonymousReadOnly: false,
            partAuthType: '0',
            options: ["",""]
        }

        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.onChangeAnonymousType = this.onChangeAnonymousType.bind(this);
        this.onChangePartAuthType = this.onChangePartAuthType.bind(this);
        this.addOptions = this.addOptions.bind(this);
        this.deleteOptions = this.deleteOptions.bind(this);
        this.onVoteCreate = this.onVoteCreate.bind(this);
        this.onChangeOptions = this.onChangeOptions.bind(this);
    }

    handleClose() {
        this.setState({
            show: false,
            anonymousType: '0',
            anonymousReadOnly: false,
            partAuthType: '0',
            options: ["",""]
        });
    }

    handleShow() {
        this.setState({show:true});
    }

    onChangeAnonymousType(e){
        if(this.state.anonymousType === '0')
            this.setState({anonymousType: '1'});
        else
            this.setState({anonymousType: '0'});
    }

    onChangePartAuthType(e){
        if(e.currentTarget.value === '1')
            this.setState({
                partAuthType: e.currentTarget.value,
                anonymousType: '1',
                anonymousReadOnly: true
            });
        else
            this.setState({
                partAuthType: e.currentTarget.value,
                anonymousReadOnly: false
            });
    }

    addOptions(e){
        e.preventDefault();
        let _options = this.state.options.slice();
        _options[_options.length] = "";

        this.setState({
            options: _options
        });
    }

    deleteOptions(e){
        e.preventDefault();
        let idx = e.currentTarget.dataset.idx;
        this.state.options.splice(idx,1);
        this.setState({
            options: this.state.options
        });
    }

    onVoteCreate(e){
        e.preventDefault();
        this.handleClose();

        let _choices ="";
        for(let i=0;i<e.currentTarget.choices.length;i++){
            _choices += e.currentTarget.choices[i].value;
            _choices += "|";
        }
        _choices = _choices.substring(0,_choices.length-1);

        let _deadline = e.currentTarget.vote_end_date.value+" "+e.currentTarget.vote_end_time.value;
        let _is_comment_enable = '0';
        if(e.currentTarget.comment_check.checked)
            _is_comment_enable = '1';
        let _is_anonymous = '0';
        if(e.currentTarget.anonymous_check.checked)
            _is_anonymous = '1';
        let _vote_type = '0';
        if(e.currentTarget.vote_type.checked)
            _vote_type = '1';

        let vote = {
            vote_title: e.currentTarget.title.value,
            choices: _choices,
            vote_type: _vote_type,

            url_name: e.currentTarget.title.url_name,
            room_id: this.props.currentRoomId,
            deadline : _deadline,
            is_anonymous: _is_anonymous,
            is_comment_enable: _is_comment_enable,
            part_auth: e.currentTarget.part_auth.value
        };
        this.props.onVoteCreate(vote);
    }

    onChangeOptions(e){
        let idx = e.currentTarget.dataset.idx;
        let _options = this.state.options.slice();
        _options[idx] = e.currentTarget.value;

        this.setState({
            options:_options 
        });
    }

    render(){
        let _options = [];
        for(let i=0;i<this.state.options.length;i++){
            _options.push(
                <InputGroup className="mb-3" key={i+1}>
                    <FormControl 
                        name="choices"
                        value={this.state.options[i]} 
                        onChange={this.onChangeOptions}
                        data-idx={i}
                        required/>
                    <InputGroup.Append>
                        <Button variant="danger" data-idx={i} onClick={this.deleteOptions}>
                            <span><i className="fas fa-minus"></i></span>
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
            )
        }

        return(
            <>
            <Button variant="light" className="float-right" onClick={this.handleShow}>
                <span>
                    <i className="fas fa-plus"></i>
                </span>
            </Button>
            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Make Simpoll</Modal.Title>
                </Modal.Header>
                <Form onSubmit={this.onVoteCreate}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Simpoll Name</Form.Label>
                            <Form.Control name="title" type="text" placeholder="심폴 이름을 입력하세요." required/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>URL</Form.Label>
                            <Form.Control name="url_name" type="text" placeholder="URL을 입력하세요."/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>선택지</Form.Label>
                            <Button onClick={this.addOptions}>
                                <i className="fas fa-plus"></i>
                            </Button>
                            {_options}
                        </Form.Group>
                        <Form.Group>
                            <Form.Check 
                                inline
                                type="checkbox" 
                                name="comment_check" 
                                value='1' 
                                label="Comment 생성 여부"/>
                            <Form.Check 
                                inline
                                type="checkbox" 
                                name="anonymous_check" 
                                value='1' 
                                checked={this.state.anonymousType === '1'}
                                onChange={this.onChangeAnonymousType}
                                readOnly={this.state.anonymousReadOnly}
                                label="익명 투표 여부"/>
                            <Form.Check 
                                inline
                                type="checkbox" 
                                name="vote_type" 
                                value='1' 
                                label="복수 선택 여부"/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>참여 권한</Form.Label>
                            <Form.Check 
                                inline
                                type="radio" 
                                name="part_auth" 
                                value='0' 
                                label="로그인 한 누구나"
                                checked={this.state.partAuthType === "0"}
                                onChange={this.onChangePartAuthType}/>
                            <Form.Check 
                                inline
                                type="radio" 
                                name="part_auth" 
                                value='1'
                                label="링크를 가진 누구나" 
                                checked={this.state.partAuthType === "1"}
                                onChange={this.onChangePartAuthType}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>마감 기한</Form.Label>
                            <input type="date" name="vote_end_date" required/>
                            <input type="time" name="vote_end_time" required/>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                        <Button variant="primary" type="submit">Submit</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            </>
        );
    }
}

export default VoteModal;
