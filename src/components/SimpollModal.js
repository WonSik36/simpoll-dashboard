import React from 'react';
import {Modal, Form, Button, FormControl,InputGroup,FormGroup} from 'react-bootstrap';

class SimpolllModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
            anonymousType: '0',
            anonymousReadOnly: false,
            partAuthType: '0',
            questions:[
                {
                    title:"",
                    choice_no: 2,
                    question_type: "0",
                    options: ["",""]
                }
            ]
        }

        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.onChangeAnonymousType = this.onChangeAnonymousType.bind(this);
        this.onChangePartAuthType = this.onChangePartAuthType.bind(this);
        this.addOptions = this.addOptions.bind(this);
        this.deleteOptions = this.deleteOptions.bind(this);
        this.addQuestions = this.addQuestions.bind(this);
        this.deleteQuestions = this.deleteQuestions.bind(this);
        this.onSimpollCreate = this.onSimpollCreate.bind(this);
        this.onOptionChange = this.onOptionChange.bind(this);
        this.onQuestionTitleChange = this.onQuestionTitleChange.bind(this);
        this.onQuestionTypeChange = this.onQuestionTypeChange.bind(this);
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
        let qidx = e.currentTarget.dataset.qidx;
        let _options = this.state.questions[qidx].options;
        _options[_options.length] = "";
        this.state.questions[qidx].choice_no++;

        this.setState({
            questions: this.state.questions
        });
    }

    deleteOptions(e){
        e.preventDefault();
        let qidx = e.currentTarget.dataset.qidx;
        let oidx = e.currentTarget.dataset.oidx;
        this.state.questions[qidx].options.splice(oidx,1);
        this.state.questions[qidx].choice_no--;
        this.setState({
            questions: this.state.questions
        });
    }

    addQuestions(e){
        e.preventDefault();
        let _questions = this.state.questions.slice();
        _questions[_questions.length] = {
            title:"",
            choice_no: 2,
            question_type: "0",
            options: ["",""]
        };

        this.setState({questions: _questions});
    }

    deleteQuestions(e){
        e.preventDefault();
        this.state.questions.splice(e.currentTarget.dataset.qidx,1);
        this.setState({questions: this.state.questions});
    }

    onOptionChange(e){
        let qidx = e.currentTarget.dataset.qidx;
        let oidx = e.currentTarget.dataset.oidx;
        this.state.questions[qidx].options[oidx] = e.currentTarget.value;
        this.setState({questions: this.state.questions});
    }

    onQuestionTitleChange(e){
        let idx = e.currentTarget.dataset.qidx;
        let title = e.currentTarget.value;
        this.state.questions[idx].title = title;

        this.setState({questions: this.state.questions});
    }

    onQuestionTypeChange(e){
        let idx = e.currentTarget.dataset.qidx;
        if(e.currentTarget.checked){
            this.state.questions[idx].question_type = "1";
        }else{
            this.state.questions[idx].question_type = "0";
        }

        this.setState({questions: this.state.questions});
    }

    onSimpollCreate(e){
        debugger;
        e.preventDefault();
        this.handleClose();

        let _deadline = e.currentTarget.simpolll_end_date.value+" "+e.currentTarget.simpolll_end_time.value;
        let _is_comment_enable = '0';
        if(e.currentTarget.comment_check.checked)
            _is_comment_enable = '1';
        let _is_anonymous = '0';
        if(e.currentTarget.anonymous_check.checked)
            _is_anonymous = '1';

        let simpolll = {
            title: e.currentTarget.title.value,
            url_name: e.currentTarget.url_name.value,
            room_id: this.props.currentRoomId,
            deadline : _deadline,
            is_anonymous: _is_anonymous,
            is_comment_enable: _is_comment_enable,
            part_auth: e.currentTarget.part_auth.value,

            questions: this.state.questions.slice()
        };
        this.props.onSimpollCreate(simpolll);
    }

    render(){
        let _questions = [];
        for(let j=0;j<this.state.questions.length;j++){
            let _options = [];
            for(let i=0;i<this.state.questions[j].options.length;i++){
                _options.push(
                    <InputGroup className="mb-3" key={i+1}>
                        <FormControl 
                            name="choices"
                            value={this.state.questions[j].options[i]} 
                            onChange={this.onOptionChange}
                            data-oidx={i} data-qidx={j}
                            required/>
                        <InputGroup.Append>
                            <Button variant="danger" data-oidx={i} data-qidx={j} onClick={this.deleteOptions}>
                                <span><i className="fas fa-minus"></i></span>
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                )
            }

            _questions.push(
                <FormGroup key={j}>
                    <Form.Label>문항 내용</Form.Label>
                    <Form.Control 
                        type="text" 
                        data-qidx={j}
                        placeholder="문항 내용을 입력하세요." 
                        value = {this.state.questions[j].title}
                        onChange={this.onQuestionTitleChange}
                        required/>
                    <Form.Label>선택지</Form.Label>
                    <Button variant="success" onClick={this.addOptions} data-qidx={j}>
                        <i className="fas fa-plus"></i>
                    </Button>
                    {_options}
                    <br/>
                    <Form.Check 
                    inline
                    type="checkbox" 
                    name="simpolll_type" 
                    value={this.state.questions[j].question_type}
                    onChange = {this.onQuestionTypeChange}
                    data-qidx={j}
                    label="복수 선택 여부"/>
                    <Button variant="danger" onClick={this.deleteQuestions} data-qidx={j}>
                        문항 삭제
                    </Button>
                </FormGroup>
            );
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
                <Form onSubmit={this.onSimpollCreate}>
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
                            <Form.Label>문항</Form.Label>
                            <Button onClick={this.addQuestions}>
                                <i className="fas fa-plus"></i>
                            </Button>
                            {_questions}
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
                            <input type="date" name="simpolll_end_date" required/>
                            <input type="time" name="simpolll_end_time" required/>
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

export default SimpolllModal;
