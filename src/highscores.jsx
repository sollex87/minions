import swalreact from '@sweetalert/with-react';
import React from 'react';

export default class Highscores extends React.Component {
    constructor() {
        super();

        this.SECRET_KEY = '$2a$10$5xA6OFP4qnNwimKo5/eK0eLoN60N/mcBIpajju/F4nxswjlvxe1Ti';
        this.BIN_ID = '5c08228f1deea01014bdeca1';
    }

    getData() {
        return fetch(`https://api.jsonbin.io/b/${this.BIN_ID}/latest`, {
            method: 'GET',
            headers: {
                'secret-key': this.SECRET_KEY,
                private: 'true',
            },
        }).then(res => res.json())
    }

    sortData(data) {
        return data.sort((a, b) => b[1] - a[1]).slice(0, 3);
    }

    Preloader() {
        return (
            <div className="preloader">
                <div className="container">
                    <span className="line line-1"></span>
                    <span className="line line-2"></span>
                    <span className="line line-3"></span>
                    <span className="line line-4"></span>
                    <span className="line line-5"></span>
                    <span className="line line-6"></span>
                    <span className="line line-7"></span>
                    <span className="line line-8"></span>
                    <span className="line line-9"></span>
                </div>
            </div>
        )
    }
    
    Result(props) {
        console.log(props);
        const output = [];
        for (let i = 0; i < 3; i += 1) {
            output.push(<p key={i}>
                {props.data[i][0]}: {props.data[i][1]}
            </p>)
        }
        return (
            <React.Fragment>
                <h1>{props.title}</h1>
                {output}
            </React.Fragment>
        )
    }

    showScores() {
        swalreact(<this.Preloader />,
            {
                buttons: false
            });
        this.getData()
            .then((res) => {
                swalreact(
                    <div>
                        <this.Result title="Barley Break" data={this.sortData(res.barley)} />
                        <this.Result title="Hangman" data={this.sortData(res.hangman)} />
                        <this.Result title="Find Match" data={this.sortData(res.memory)} />
                    </div>
                )
            })
    }
}