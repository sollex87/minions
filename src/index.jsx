import React from 'react';
import ReactDOM from 'react-dom';
import Hangman from './hangman.js';
import BarleyBreak from './barley-break.js';
import Memory from './memory.js';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import swal from 'sweetalert';

const root = document.getElementById('root');
const mute = document.createElement('div');
const repository = '/minions';
const barleyLink = '/barley-break';
const hangmanLink = '/hangman';
const memoryLink = '/memory';

const winImg = new Image(300);
const lossImg = new Image(300);
const greetImg = new Image(300);
const welcomeSound = new Audio();
const onClickSound = new Audio();
const onLossSound = new Audio();
const onWinSound = new Audio();

const iconBarleyPath = require('../assets/icon-barley.png');
const iconHangmanPath = require('../assets/icon-hangman.png');
const iconMemoryPath = require('../assets/icon-memory.png');
winImg.src = require('../assets/win_case.jpg');
lossImg.src = require('../assets/loss_case.jpg');
greetImg.src = require('../assets/start.jpg');
welcomeSound.src = require('../assets/welcome.mp3');
onClickSound.src = require('../assets/click.mp3');
onLossSound.src = require('../assets/loss.mp3');
onWinSound.src = require('../assets/win.mp3');

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

    greetingText(props) {
        return (
            <span>
                {props.data[Math.floor(Math.random() * 5)]}
            </span>
        )
    }

    render() {
        return (
            <div id="header" className="header">
                <p>
                    <this.greetingText data={this.state.greetingText} />, <span>{this.state.userName ? this.state.userName : this.state.userDefault}</span>!
                </p>
                <this.headerButtons name={this.state.userName} logOut={this.logOut} logIn={this.logIn} />
            </div>
        )
    }
}

class HangmanLauncher extends React.Component {
    constructor() {
        super();

        this.state = {
            rules: 'Guess the word from a given category in 5 attempts!'
        }

        this.showRules = this.showRules.bind(this);
    }

    showRules() {
        swal({
            title: this.state.rules
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="app-menu">
                    <Link to={`${repository}/`}><span id="back">Back</span></Link>
                    <div className="new-game">New Game</div>
                    <div className="rules" onClick={this.showRules}>Rules</div>
                </div>
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
        this.backButton = document.getElementById('back');
        this.newGame = document.getElementsByClassName('new-game')[0];
        this.input = document.getElementById('letter');
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
            onLeaveConfirm()
                .then((confirm) => {
                    if (confirm) {
                        this.input.disabled = false;
                        this.game = new Hangman();
                        this.game.initialize();
                        this.game.draw();
                    }
                });
        }
    }
}

class BarleyLauncher extends React.Component {
    constructor() {
        super();

        this.state = {
            clicks: 0,
            rules: 'Place chips in order from 1 to 15 using the only free spot!'
        }

        this.showRules = this.showRules.bind(this);
    }

    showRules() {
        swal({
            title: this.state.rules
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="app-menu">
                    <Link to={`${repository}/`}><span id="back">Back</span></Link>
                    <div className="new-game">New Game</div>
                    <div className="rules" onClick={this.showRules}>Rules</div>
                    <div className="clicks">Clicks: <span id="span-clicks">0</span></div>
                </div>
                <canvas id="barley-canvas" />
            </React.Fragment>
        )
    }

    componentDidMount() {
        this.backButton = document.getElementById('back');
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
            onLeaveConfirm()
                .then((confirm) => {
                    if (confirm) {
                        this.game = new BarleyBreak(this.context, this.cellSize);
                        this.game.mix(300);
                        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
                        this.game.draw();
                        this.clicksDisplay.innerText = this.game.getClicks();
                    }
                });
        }
    }
}

class MemoryLauncher extends React.Component {
    constructor() {
        super();

        this.state = {
            clicks: 0,
            rules: 'Find all pairs by turning cards over for the least number of attempts!'
        }

        this.showRules = this.showRules.bind(this);
    }

    render() {
        return (
            <React.Fragment>
                <div className="app-menu">
                    <Link to={`${repository}/`}><span id="back">Back</span></Link>
                    <div className="new-game">New Game</div>
                    <div className="rules" onClick={this.showRules}>Rules</div>
                    <div className="clicks">Tries: <span id="span-clicks">0</span></div>
                </div>
                <div id='memory' />
            </React.Fragment>
        )
    }

    clearField() {
        this.display = document.getElementById('memory');
        while (this.display.firstChild) {
            this.display.removeChild(this.display.firstChild);
        };
    }

    init() {
        this.clearField();
        this.game = new Memory();
        this.clicksDisplay.innerText = this.game.getClicks();
        this.game.createCards();
    }

    showRules() {
        swal({
            title: this.state.rules
        });
    }

    componentDidMount() {
        this.backButton = document.getElementById('back');
        this.newGame = document.getElementsByClassName('new-game')[0];
        this.clicksDisplay = document.getElementById("span-clicks");
        this.init();
        this.newGame.onclick = () => {
            onLeaveConfirm()
                .then((confirm) => {
                    if (confirm) {
                        this.init();
                    }
                });
        }
        this.display.onclick = () => {
            if (this.game.win()) {
                onWinSound.play();
                swal(winImg, {
                    title: "WIN!",
                    button: 'Hooray!'
                })
                    .then(() => onWinSound.pause())
                    .then(() => {
                        this.init();
                    })
            }
        }
    }
}

function Main() {
    return (
        <React.Fragment>
            <div className="main-menu">
                <Link to={`${repository}${barleyLink}`} className="game-link">
                    Barley Break
                    <img src={iconBarleyPath} alt="" width="130" height="110" />
                </Link>
                <Link to={`${repository}${hangmanLink}`} className="game-link">
                    Hangman
                    <img src={iconHangmanPath} alt="" width="130" height="110" />
                </Link>
                <Link to={`${repository}${memoryLink}`} className="game-link">
                    Find Match
                    <img src={iconMemoryPath} alt="" width="130" height="110" />
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

function onLeaveConfirm() {
    return swal({
        title: "Are you sure?",
        text: "Current progress will not be saved!",
        buttons: true,
        dangerMode: true,
    })
}

function createMuteButton() {
    mute.innerText = 'mute';
    mute.classList.add('mute');
    document.getElementsByClassName('wrapper')[0].append(mute);
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

ReactDOM.render(<GameRouter />, root);