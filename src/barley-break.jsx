import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import swal from 'sweetalert';

export default class BarleyLauncher extends React.Component {
    constructor() {
        super();

        this.state = {
            clicks: 0,
            rules: 'Place chips in order from 1 to 15 using the only free spot!'
        }

        this.repository = '/minions';

        this.winImg = new Image(300);
        
        this.onWinSound = new Audio();

        this.winImg.src = require('../assets/win_case.jpg');
        this.onWinSound.src = require('../assets/win.mp3');

        this.showRules = this.showRules.bind(this);
        this.onLeaveConfirm = this.onLeaveConfirm.bind(this);
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
                <div className="clicks">Clicks: <span id="span-clicks">0</span></div>
                <canvas id="barley-canvas" />
            </React.Fragment>
        )
    }

    onLeaveConfirm() {
        return swal({
            title: "Are you sure?",
            text: "Current progress will not be saved!",
            buttons: true,
            dangerMode: true,
        })
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

        this.canvas.addEventListener('click', (e) => {
            let x = (e.pageX - this.canvas.offsetLeft) / this.cellSize | 0; // клик события
            let y = (e.pageY - this.canvas.offsetTop) / this.cellSize | 0;
            this.event(x, y);
            this.clicksDisplay.innerText = this.game.getClicks();
        });

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
                this.onWinSound.play();
                swal(this.winImg, {
                    title: "WIN!",
                    button: 'Hooray!'
                })
                    .then(() => this.onWinSound.pause())
                    .then(() => {
                        this.game.mix(300);
                        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
                        this.game.draw(this.context, this.cellSize);
                    })
            }
        }
        this.newGame.onclick = () => {
            this.onLeaveConfirm()
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

function BarleyBreak(context, cellSize) {
    const arr = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 0]
    ];

    let clicks = 0;
    const clickSound = new Audio();
    clickSound.src = require('../assets/click.mp3');

    function cellView(x, y) {
        context.clearRect(x + 1, y + 1, cellSize - 2, cellSize - 2); // очистка ячейки
    }

    function numView() {
        context.font = "normal " + (cellSize / 3) + "px Gloria Hallelujah, sans-serif"; // стилизация чисел
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "#000000";
    }

    this.getNullCell = function () { // определение пустой ячейки
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (arr[j][i] === 0) {
                    return { 'x': i, 'y': j };
                }
            }
        }
    };

    this.draw = function () { // основная отрисовка
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (arr[i][j] > 0) {
                    cellView(j * cellSize, i * cellSize);
                    numView();
                    context.fillText(arr[i][j], j * cellSize + cellSize / 2, i * cellSize + cellSize / 2);
                }
            }
        }
    };

    this.shuffle = function (x, y) { // движение
        let nullX = this.getNullCell().x;
        let nullY = this.getNullCell().y;
        if (((x - 1 == nullX || x + 1 == nullX) && y == nullY) || ((y - 1 == nullY || y + 1 == nullY) && x == nullX)) {
            arr[nullY][nullX] = arr[y][x];
            arr[y][x] = 0;
        }
    };

    this.move = function (x, y) { // движение
        let nullX = this.getNullCell().x;
        let nullY = this.getNullCell().y;
        if (((x - 1 == nullX || x + 1 == nullX) && y == nullY) || ((y - 1 == nullY || y + 1 == nullY) && x == nullX)) {
            arr[nullY][nullX] = arr[y][x];
            arr[y][x] = 0;
            clicks++;
            clickSound.play();
        }
    };

    this.victory = () => { // в случае победы
        const e = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];
        let res = true;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (e[i][j] != arr[i][j]) {
                    res = false;
                }
            }
        }
        return res;
    };

    function getRandom() {
        if (Math.floor(Math.random() * 2) === 0) {
            return true;
        }
    }

    this.mix = function (stepCount) { //перемешивание
        let x, y;
        for (let i = 0; i < stepCount; i++) {
            const nullX = this.getNullCell().x;
            const nullY = this.getNullCell().y;
            const hMove = getRandom();
            const upLeft = getRandom();
            if (!hMove && !upLeft) {
                y = nullY;
                x = nullX - 1;
            }
            if (hMove && !upLeft) {
                x = nullX;
                y = nullY + 1;
            }
            if (!hMove && upLeft) {
                y = nullY;
                x = nullX + 1;
            }
            if (hMove && upLeft) {
                x = nullX;
                y = nullY - 1;
            }
            if (0 <= x && x <= 3 && 0 <= y && y <= 3) {
                this.shuffle(x, y);
            }
        }
        clicks = 0;
    };

    this.getClicks = () => {
        return clicks;
    };
}