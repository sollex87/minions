import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import swal from 'sweetalert';

export default class HangmanLauncher extends React.Component {
    constructor() {
        super();

        this.state = {
            rules: 'Guess the word from a given category in 5 attempts!'
        }

        this.repository = '/minions';

        this.winImg = new Image(300);
        this.lossImg = new Image(300);

        this.onWinSound = new Audio();
        this.onLossSound = new Audio();
        this.onClickSound = new Audio();

        this.winImg.src = require('../assets/win_case.jpg');
        this.lossImg.src = require('../assets/loss_case.jpg');
        this.onWinSound.src = require('../assets/win.mp3');
        this.onLossSound.src = require('../assets/loss.mp3');
        this.onClickSound.src = require('../assets/click.mp3');

        this.showRules = this.showRules.bind(this);
        this.onLeaveConfirm = this.onLeaveConfirm.bind(this);
    }

    onLeaveConfirm() {
        return swal({
            title: "Are you sure?",
            text: "Current progress will not be saved!",
            buttons: true,
            dangerMode: true,
        })
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
                    <Link to={`${this.repository}/`}><span id="back">Back</span></Link>
                    <div className="new-game">New Game</div>
                    <div className="rules" onClick={this.showRules}>Rules</div>
                </div>
                <div className="hangman-main">
                    <canvas id="hangman-canvas" />
                    <div className="hangman-interact">
                        <div id="display" />
                        <input type="text" id='letter' className='hangman-input' placeholder="Type letter here" />
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
            this.onClickSound.play();
            this.game.compareChar(this.input.value);
            this.game.draw();
            this.input.value = '';
            if (this.game.loss) {
                this.onLossSound.play();
                swal(this.lossImg, {
                    title: "LOSS!",
                    button: 'Try again!'
                })
                    .then(() => this.onLossSound.pause())
                    .then(() => {
                        this.game = new Hangman();
                        this.game.initialize();
                        this.game.draw();
                    })
            }
            else if (this.game.win) {
                this.onWinSound.play();
                swal(this.winImg, {
                    title: "WIN!",
                    button: 'Hooray!'
                })
                    .then(() => this.onWinSound.pause())
                    .then(() => {
                        this.game = new Hangman();
                        this.game.initialize();
                        this.game.draw();
                    })
            }
        })
        this.newGame.onclick = () => {
            this.onLeaveConfirm()
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

class Hangman {
    constructor() {
        this.words = {
            'a capital': [
                'Baghdad', 'Bangkok', 'Beijing', 'Belfast', 'Caracas', 'Colombo', 'Jakarta', 'Nairobi', 'Nicosia', 'Tallinn', 'Tripoli',
            ],
            'a food': [
                'Avocado', 'Cabbage', 'Coconut', 'Lettuce', 'Parsley', 'Romaine', 'Shallot', 'Spinach', 'Sprouts',
            ],
            'an animal': [
                'Gorilla', 'Cheetah', 'Giraffe', 'Raccoon', 'Peacock', 'Hamster', 'Dolphin', 'Echidna', 'Gazelle', 'Leopard', 'Leopard',
            ],
            'a country': [
                'Albania', 'Armenia', 'Austria', 'Belarus', 'England', 'Croatia', 'Ecuador', 'Finland', 'Holland', 'Hungary', 'Jamaica', 'Ukraine',
            ],
        };
        this.parts =
            [
                new Image(120),
                new Image(120),
                new Image(120),
                new Image(120),
                new Image(120)
            ];
        this.preload = new Image(120);

        this.preload.src = require('../assets/hangman.jpg');
        this.parts[0].src = require('../assets/hangman/hangman_1.png');
        this.parts[1].src = require('../assets/hangman/hangman_2.png');
        this.parts[2].src = require('../assets/hangman/hangman_3.png');
        this.parts[3].src = require('../assets/hangman/hangman_4.png');
        this.parts[4].src = require('../assets/hangman/hangman_5.png');

        this.triesCount = 5;
        this.category = '';
        this.word = '';
        this.maskedWord = [];
        this.hiddenLettersAmount = 0;
        this.usedLetters = [];
        this.win = false;
        this.loss = false;
    }

    initialize() {
        this.clearField();
        this.setWord();
        this.maskWord();
        this.displayGameInfo();
    }

    draw() {
        this.canvas = document.getElementById('hangman-canvas');
        this.canvas.height = 320;
        this.canvas.width = 120;
        this.context = this.canvas.getContext('2d');
        this.preload.onload = () => {
            this.context.drawImage(this.preload, 0, 0, this.canvas.width, this.canvas.height);
        }
        for (let i = 0; i < this.triesCount; i += 1) {
            this.context.drawImage(this.parts[i], 0, 0, this.canvas.width, this.canvas.height);
        }
    }

    clearField() {
        const display = document.getElementById('display');
        while (display.firstChild) {
            display.removeChild(display.firstChild);
        }
    }

    getRandomWord(data) {
        const item = data[Math.floor(Math.random() * data.length)];
        return item;
    };

    setWord() {
        this.category = this.getRandomWord(Object.keys(this.words));
        this.word = this.getRandomWord(this.words[this.category]);
    }

    maskWord() {
        let maskedWord = [...this.word.toLowerCase()];
        for (let i = 0; i < maskedWord.length; i += 1) {
            maskedWord[i] = '_ ';
        }
        this.maskedWord = maskedWord;
        this.hiddenLettersAmount = maskedWord.length;
    }

    displayGameInfo() {
        const display = document.getElementById('display');

        const сategoryField = document.createElement('p');
        сategoryField.innerText = `Your word is ${this.category}.`;
        display.append(сategoryField);

        const wordField = document.createElement('p');
        wordField.innerText = this.maskedWord.join('');
        wordField.classList.add('hangman-mask');
        display.append(wordField);

        const usedLettersField = document.createElement('p');
        usedLettersField.innerText = `Used: ${this.usedLetters.join(' ')}`;
        display.append(usedLettersField);
    }

    checkEndGame() {
        if (this.hiddenLettersAmount === 0 && this.triesCount > 0) {
            this.win = true;
        }
        if (this.hiddenLettersAmount > 0 && this.triesCount === 0) {
            this.loss = true;
        }
    }

    compareChar(data) {
        data = data.toLowerCase();
        let guessed = false;
        let used = false;
        for (let i = 0; i < this.usedLetters.length; i += 1) {
            if (data == this.usedLetters[i]) {
                used = true;
                guessed = true;
                break;
            }
        }
        if (!used) {
            this.usedLetters.push(data);
            for (let i = 0; i < this.maskedWord.length; i += 1) {
                if (data == this.word[i].toLowerCase()) {
                    this.maskedWord[i] = `${data} `;
                    this.hiddenLettersAmount--;
                    guessed = true;
                }
            }
        }
        if (!guessed) {
            this.triesCount--;
        }
        this.clearField();
        this.checkEndGame();
        this.displayGameInfo();
    }
}