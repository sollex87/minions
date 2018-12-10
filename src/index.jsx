import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import swal from 'sweetalert';
import HangmanLauncher from './hangman.jsx';
import BarleyLauncher from './barley-break.jsx';
import MemoryLauncher from './memory.jsx';
import Highscores from './highscores.jsx';

const root = document.getElementById('root');
const mute = document.createElement('div');
const repository = '/minions';
const barleyLink = '/barley-break';
const hangmanLink = '/hangman';
const memoryLink = '/memory';

const greetImg = new Image(300);
const welcomeSound = new Audio();

const iconBarleyPath = require('../assets/icon-barley.png');
const iconHangmanPath = require('../assets/icon-hangman.png');
const iconMemoryPath = require('../assets/icon-memory.png');

greetImg.src = require('../assets/start.jpg');
welcomeSound.src = require('../assets/welcome.mp3');

class Header extends React.Component {
    constructor() {
        super();

        this.state = {
            userName: '',
            userDefault: 'guest',
            greetingText: [
                'Hi',
                'Hello',
                'Good day',
                'Howdy',
                "What's up"
            ]
        };

        this.logOut = this.logOut.bind(this);
        this.logIn = this.logIn.bind(this);
        this.greetingText = this.greetingText.bind(this);
        this.getScores = this.getScores.bind(this);
    }

    logOut() {
        this.setState({ userName: '' })
    }

    logIn() {
        swal({
            title: "Enter your name!",
            content: "input",
        })
            .then((value) => {
                this.setState({ userName: value });
            });

    }

    headerButtons(props) {
        if (props.name) {
            return (
                <div onClick={props.logOut} className="button">
                    Log Out
                </div>
            )
        }

        return (
            <div onClick={props.logIn} className="button">
                Log In
            </div>
        )
    }

    greetingText(props) {
        return (
            <span>
                {props.data[Math.floor(Math.random() * 5)]}
            </span>
        )
    }

    getScores() {
        const score = new Highscores();
        score.showScores();
    }

    render() {
        return (
            <div id="header" className="header">
                <div className="header-name">
                    <this.greetingText data={this.state.greetingText} />, <span className="header-name-span">{this.state.userName ? this.state.userName : this.state.userDefault}!</span>
                </div>
                <div className="header-buttons">
                    <div className="button" onClick={this.getScores}>Highscores</div>
                    <this.headerButtons name={this.state.userName} logOut={this.logOut} logIn={this.logIn} />
                </div>
            </div>
        )
    }
}

function Main() {
    return (
        <React.Fragment>
            <div className="main-menu">
                <Link to={`${repository}${barleyLink}`} className="game-link">
                    Barley Break
                    <img src={iconBarleyPath} alt="" width="110" height="110" />
                </Link>
                <Link to={`${repository}${hangmanLink}`} className="game-link">
                    Hangman
                    <img src={iconHangmanPath} alt="" width="110" height="110" />
                </Link>
                <Link to={`${repository}${memoryLink}`} className="game-link">
                    Find Match
                    <img src={iconMemoryPath} alt="" width="110" height="110" />
                </Link>
            </div>
        </React.Fragment>
    )
}

function NotFound() {
    return (
        <React.Fragment>
            <div className="main-menu">
                <Link to={`${repository}/`}>To Games List</Link>
            </div>
            <p>Sorry, we don't have a game like this yet :)</p>
        </React.Fragment>
    )
}

function GameRouter() {
    return (
        <Router>
            <React.Fragment>
                <Header />
                <Switch>
                    <Route path={`${repository}/`} exact component={Main} />
                    <Route path={`${repository}/hangman`} exact component={HangmanLauncher} />
                    <Route path={`${repository}/barley-break`} exact component={BarleyLauncher} />
                    <Route path={`${repository}/memory`} exact component={MemoryLauncher} />
                    <Route component={NotFound} />
                </Switch>
            </React.Fragment>
        </Router>
    )
}

function createMuteButton() {
    mute.innerText = 'Mute';
    mute.classList.add('button');
    document.getElementsByClassName('header-buttons')[0].append(mute);
    mute.addEventListener('click', removeMuteButton);
}

function removeMuteButton() {
    welcomeSound.pause();
    mute.remove();
}

window.addEventListener('load', () => {
    swal(greetImg, {
        className: 'welcome',
        button: 'Play!'
    })
        .then(() => {
            welcomeSound.play();
            createMuteButton();
            welcomeSound.onended = removeMuteButton;
        })
});

const qrcode = document.getElementById('qrcode');
qrcode.addEventListener('click', () => {
    qrcode.remove();
})

ReactDOM.render(<GameRouter />, root);