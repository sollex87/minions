import React from 'react';
import ReactDOM from 'react-dom';
import Hangman from './hangman.js';
import BarleyBreak from './barley-break.js';
import Memory from './memory.js';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import swal from 'sweetalert';

const header = document.getElementById('header');
const root = document.getElementById('root');
const repository = '/minions';
const winImg = new Image(300);
const lossImg = new Image(300);
const greetImg = new Image(300);
const greetingSound = new Audio();
const onClickSound = new Audio();
const onLossSound = new Audio();
const onWinSound = new Audio();


winImg.src = require('../assets/win_case.jpg');
lossImg.src = require('../assets/loss_case.jpg');
greetImg.src = require('../assets/start.jpg');
greetingSound.src = require('../assets/welcome.mp3');
onClickSound.src = require('../assets/click.mp3');
onLossSound.src = require('../assets/loss.mp3');
onWinSound.src = require('../assets/win.mp3');

class Header extends React.Component {
    constructor() {
        super();

        this.state = {
            userName: '',
            userDefault: 'guest',
        };

        this.logOut = this.logOut.bind(this);
        this.logIn = this.logIn.bind(this);
    }

    logOut() {
        this.setState({ userName: '' })
    }

    logIn() {
        const name = prompt('Enter your name:', '');
        this.setState({ userName: name })
    }

    headerButtons(props) {
        if (props.name) {
            return (
                <p onClick={props.logOut}>
                    Log Out
                </p>
            )
        }

        return (
            <p onClick={props.logIn}>
                Log In
            </p>
        )
    }

    render() {
        return (
            <React.Fragment>
                <p>
                    <span id='header-greeting'>Hello</span>, <span id='header-name'>{this.state.userName ? this.state.userName : this.state.userDefault}</span>!
                </p>
                <this.headerButtons name={this.state.userName} logOut={this.logOut} logIn={this.logIn} />
            </React.Fragment>
        )
    }
}

function Main() {
    return (
        <React.Fragment>
            <ul>
                <li><Link to={`${repository}/hangman`}>Hangman</Link></li>
                <li><Link to={`${repository}/barley-break`}>Barley Break</Link></li>
                <li><Link to={`${repository}/memory`}>Find A Match</Link></li>
            </ul>
        </React.Fragment>
    )
}

function NotFound() {
    return (
        <React.Fragment>
            <ul>
                <li><Link to={`${repository}/`}>Main</Link></li>
            </ul>
            <p>Sorry, we don't have a game like this yet :)</p>
        </React.Fragment>
    )
}

function GameRouter() {
    return (
        <Router>
            <React.Fragment>
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

class HangmanLauncher extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <React.Fragment>
                <ul>
                    <li><Link to={`${repository}/`}>Main</Link></li>
                    <li className="new-game">New Game</li>
                </ul>
                <div className="hangman-main">
                    <canvas id="hangman-canvas" />
                    <div className="hangman-interact">
                        <div id="display" />
                        <input type="text" id='letter' placeholder="Type letter here..." />
                    </div>
                </div>
            </React.Fragment>
        )
    }

    componentDidMount() {
        this.newGame = document.getElementsByClassName('new-game')[0];
        this.input = document.getElementById('letter');
        this.input.disabled = false;
        this.reset = document.getElementById('reset');
        this.game = new Hangman();
        this.game.initialize();
        this.game.draw();
        this.input.addEventListener('input', () => {
            onClickSound.play();
            this.game.compareChar(this.input.value);
            this.game.draw();
            this.input.value = '';
            if (this.game.loss) {
                onLossSound.play();
                swal(lossImg, {
                    title: "LOSS!",
                    button: 'Try again!'
                })
                    .then(() => onLossSound.pause())
                    .then(() => {
                        this.game = new Hangman();
                        this.game.initialize();
                        this.game.draw();
                    })
            }
            else if (this.game.win) {
                onWinSound.play();
                swal(winImg, {
                    title: "WIN!",
                    button: 'Hooray!'
                })
                    .then(() => onWinSound.pause())
                    .then(() => {
                        this.game = new Hangman();
                        this.game.initialize();
                        this.game.draw();
                    })
            }
        })
        this.newGame.onclick = () => {
            onClickSound.play();
            this.input.disabled = false;
            this.game = new Hangman();
            this.game.initialize();
            this.game.draw();
        }
    }
}

class BarleyLauncher extends React.Component {
    constructor() {
        super();

        this.state = {
            clicks: 0,
        }
    }

    render() {
        return (
            <React.Fragment>
                <ul>
                    <li><Link to={`${repository}/`}>Main</Link></li>
                    <li className="new-game">New Game</li>
                    <li className="clicks">Clicks: <span id="span-clicks">0</span></li>
                </ul>
                <canvas id="barley-canvas" />
            </React.Fragment>
        )
    }

    componentDidMount() {
        this.newGame = document.getElementsByClassName('new-game')[0];
        this.canvas = document.getElementById("barley-canvas");
        this.context = this.canvas.getContext("2d");
        this.clicksDisplay = document.getElementById("span-clicks");
        this.canvas.width = 320;
        this.canvas.height = 320;
        this.cellSize = this.canvas.width / 4;
        this.game = new BarleyBreak(this.context, this.cellSize);
        this.game.mix(300);
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height); //отрисовка пустой клетки
        this.game.draw();

        this.canvas.onclick = (e) => {
            let x = (e.pageX - this.canvas.offsetLeft) / this.cellSize | 0; // клик события
            let y = (e.pageY - this.canvas.offsetTop) / this.cellSize | 0;
            this.event(x, y);
            this.clicksDisplay.innerText = this.game.getClicks();
        };

        this.canvas.ontouchend = (e) => {
            let x = (e.touches[0].pageX - this.canvas.offsetLeft) / this.cellSize | 0; //тач события
            let y = (e.touches[0].pageY - this.canvas.offsetTop) / this.cellSize | 0;
            this.event(x, y);
            this.clicksDisplay.innerText = this.game.getClicks();
        };

        this.event = (x, y) => { // собираем
            this.game.move(x, y);
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height); //отрисовка пустой клетки
            this.game.draw(); //отрисовка заполненых клеток и текста
            if (this.game.victory()) { //проверка на правильность сборки
                onWinSound.play();
                swal(winImg, {
                    title: "WIN!",
                    button: 'Hooray!'
                })
                    .then(() => onWinSound.pause())
                    .then(() => {
                        this.game.mix(300);
                        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
                        this.game.draw(this.context, this.cellSize);
                    })
            }
        }
        this.newGame.onclick = () => {
            this.game = new BarleyBreak(this.context, this.cellSize);
            this.game.mix(300);
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.game.draw();
        }
    }
}

class MemoryLauncher extends React.Component {
    constructor() {
        super();

        this.state = {
            clicks: 0,
        }
    }

    render() {
        return (
            <React.Fragment>
                <ul>
                    <li><Link to={`${repository}/`}>Main</Link></li>
                    <li className="new-game">New Game</li>
                    <li className="clicks">Tries: <span id="span-clicks">0</span></li>
                </ul>
                <div id='memory' />
            </React.Fragment>
        )
    }
    componentDidMount() {
        this.newGame = document.getElementsByClassName('new-game')[0];
        this.display = document.getElementById('memory');
        this.clicksDisplay = document.getElementById("span-clicks");
        this.game = new Memory();
        this.clicksDisplay.innerText = this.game.getClicks();
        this.game.createCards();
        if (this.game.win()) {
            onWinSound.play();
            swal(winImg, {
                title: "WIN!",
                button: 'Hooray!'
            })
                .then(() => onWinSound.pause())
                .then(() => {
                    this.game = new Memory();
                    this.clicksDisplay.innerText = this.game.getClicks();
                    this.game.createCards();
                })
        }
        this.newGame.onclick = () => {
            while (this.display.firstChild) {
                this.display.removeChild(this.display.firstChild);
            };
            this.game = new Memory();
            this.clicksDisplay.innerText = this.game.getClicks();
            this.game.createCards();
        }
    }
}

const volumeReduce = () => {
    const playback = setInterval(() => {
        greetingSound.volume -= 0.1;
        if (greetingSound.volume < 0.2) {
            greetingSound.pause();
            clearInterval(playback);
        }
    }, 50)
}

window.addEventListener('load', () => {
    swal(greetImg, {
        className: 'welcome',
        button: 'Play!'
    })
        .then(() => greetingSound.play())
        .then(() => setTimeout(volumeReduce, 5500))
});

ReactDOM.render(<Header />, header);

ReactDOM.render(<GameRouter />, root);