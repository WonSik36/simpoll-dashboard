import React, { Component,Fragment } from 'react';

class Mkroom extends Component {
    render(){
        return(
            <form action="" method="post">
                <div>
                    <p>Room Name</p>
                    <input type="text" name="title" placeholder="방 이름을 입력하세요." required></input>
                </div>
                <div><hr />
                    <p>URL</p>
                    <input type="text" name="url_name" placeholder="URL을 입력하세요" required></input>
                </div>
                <div><hr />
                    <p>Simpoll 생성 권한</p>
                    <label><input type="radio" value={this.state.valueZero} checked /> 방장만</label>
                    <label><input type="radio" value={this.state.valueOne} /> 방 참여자 모두</label>
                </div>
                <div><hr />
                    <p>참여자 실명/닉네임 여부</p>
                    <label><input type="radio" value={this.state.valueZero} checked /> 실명</label>
                    <label><input type="radio" value={this.state.valueOne} /> 닉네임</label>
                </div>
            </form>
        );
    }
}

export default Mkroom;
