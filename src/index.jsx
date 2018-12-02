import React from 'react';
import ReactDOM from 'react-dom';
import Hangman from './hangman.js'
import BarleyBreak from './barley-break.js'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

const header = document.getElementById('header');
const root = document.getElementById('root');
const repository = '/minions';

// function welcomeAudio(){
//     const welcome = new Audio();
//     welcome.src = require('../assets/welcome.mp3');
//     welcome.autoplay = true;
// }

// window.onload = welcomeAudio();

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
        <Router>
            <React.Fragment>
                <ul>
                    <li><Link to={`${repository}/hangman`}>Hangman</Link></li>
                    <li><Link to={`${repository}/barley-break`}>Barley Break</Link></li>
                </ul>
            </React.Fragment>
        </Router>
    )
}

class HangmanStart extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Router>
                <React.Fragment>
                    <ul>
                        <li><Link to={`${repository}/`}>Main</Link></li>
                    </ul>
                    <div className="hangman-main">
                        <canvas id="hangman-canvas" />
                        <div className="hangman-interact">
                            <div id="display" />
                            <input type="text" id='letter' placeholder="Type letter here..." />
                            <button id="reset">New Game</button>
                        </div>
                    </div>
                </React.Fragment>
            </Router>
        )
    }

    componentDidMount() {
        this.input = document.getElementById('letter');
        this.input.disabled = false;
        this.reset = document.getElementById('reset');
        this.game = new Hangman();
        this.game.initialize();
        this.game.draw();
        this.reset.addEventListener('click', () => {
            this.input.disabled = false;
            this.game = new Hangman();
            this.game.initialize();
            this.game.draw();
        })
        this.input.addEventListener('input', () => {
            this.game.compareChar(this.input.value);
            this.game.draw();
            this.input.value = '';
            if (this.game.loss) {
                if (confirm(`Loss! The word was ${this.game.word}!
                Another try?`)) {
                    this.game = new Hangman();
                    this.game.initialize();
                    this.game.draw();
                } else {
                    this.input.disabled = true;
                };
            }
            else if (this.game.win) {
                if (confirm(`Win!
                Another try?`)) {
                    this.game = new Hangman();
                    this.game.initialize();
                    this.game.draw();
                } else {
                    this.input.disabled = true;
                };
            }
        })
    }
}

class BarleyBreakStart extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Router>
                <React.Fragment>
                    <ul>
                        <li><Link to={`${repository}/`}>Main</Link></li>
                    </ul>
                    <canvas id="barley-canvas" />
                </React.Fragment>
            </Router>
        )
    }

    componentDidMount() {
        this.canvas = document.getElementById("barley-canvas");
        this.context = this.canvas.getContext("2d");
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
        };

        this.canvas.ontouchend = (e) => {
            let x = (e.touches[0].pageX - this.canvas.offsetLeft) / this.cellSize | 0; //тач события
            let y = (e.touches[0].pageY - this.canvas.offsetTop) / this.cellSize | 0;
            this.event(x, y);
        };

        this.event = (x, y) => { // собираем
            this.game.move(x, y);
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height); //отрисовка пустой клетки
            this.game.draw(); //отрисовка заполненых клеток и текста
            if (this.game.victory()) { //проверка на правильность сборки
                alert("Поздравляем! Вы закончили игру за " + this.game.getClicks() + " ходов!");
                this.game.mix(300);
                this.context.fillRect(0, 0, this.canvas.width, this.canvas.height); //отрисовка пустой клетки
                this.game.draw(this.context, this.cellSize);
            }
        }
    }
}

function NotFound() {
    return (
        <Router>
            <React.Fragment>
                <ul>
                    <li><Link to={`${repository}/`}>Main</Link></li>
                </ul>
                <p>Sorry, we don't have a game like this yet :)</p>
            </React.Fragment>
        </Router>
    )
}

function GameRouter() {
    return (
        <Router>
            <React.Fragment>
                <Switch>
                    <Route path={`${repository}/`} exact component={Main} />
                    <Route path={`${repository}/hangman`} exact component={HangmanStart} />
                    <Route path={`${repository}/barley-break`} exact component={BarleyBreakStart} />
                    <Route component={NotFound} />
                </Switch>
            </React.Fragment>
        </Router>
    )
}

ReactDOM.render(<Header />, header);

ReactDOM.render(<GameRouter />, root);
