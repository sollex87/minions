import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import swal from 'sweetalert';

export default class MemoryLauncher extends React.Component {
  constructor() {
    super();

    this.state = {
      clicks: 0,
      rules: 'Find all pairs by turning cards over for the least number of attempts!'
    }

    this.repository = '/minions';

    this.winImg = new Image(300);

    this.onWinSound = new Audio();

    this.winImg.src = require('../assets/win_case.jpg');
    this.onWinSound.src = require('../assets/win.mp3');

    this.showRules = this.showRules.bind(this);
    this.onLeaveConfirm = this.onLeaveConfirm.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <div className="app-menu">
          <Link to={`${this.repository}/`}><span id="back">Back</span></Link>
          <div className="new-game">New Game</div>
          <div className="rules" onClick={this.showRules}>Rules</div>
        </div>
        <div className="clicks">Tries: <span id="span-clicks">0</span></div>
        <div id='memory' />
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

  clearField() {
    this.display = document.getElementById('memory');
    while (this.display.firstChild) {
      this.display.removeChild(this.display.firstChild);
    };
  }

  init() {
    this.clearField();
    this.game = new MemoryGame();
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
      this.onLeaveConfirm()
        .then((confirm) => {
          if (confirm) {
            this.init();
          }
        });
    }
    this.display.onclick = () => {
      if (this.game.win()) {
        this.onWinSound.play();
        swal(this.winImg, {
          title: "WIN!",
          button: 'Hooray!'
        })
          .then(() => this.onWinSound.pause())
          .then(() => {
            this.init();
          })
      }
    }
  }
}

class MemoryGame {
  constructor() {
    this.suits = [
      '0000',
      '0001',
      '0002',
      '0003',
      '0004',
      '0005',
      '0006',
      '0007',
      '0000',
      '0001',
      '0002',
      '0003',
      '0004',
      '0005',
      '0006',
      '0007',
    ]
    this.newSuits = this.mixSuits(this.suits);
    this.memory = document.getElementById('memory');
    this.clicksDisplay = document.getElementById("span-clicks");
    this.firstCard = null;
    this.secondCard = null;
    this.hasFlippedCard = false;
    this.lockBoard = false;
    this.countTries = 0;
    this.countPairs = 0;
    this.backURLs = {
      '0000': require('../assets/memory/0000.jpg'),
      '0001': require('../assets/memory/0001.jpg'),
      '0002': require('../assets/memory/0002.jpg'),
      '0003': require('../assets/memory/0003.jpg'),
      '0004': require('../assets/memory/0004.jpg'),
      '0005': require('../assets/memory/0005.jpg'),
      '0006': require('../assets/memory/0006.jpg'),
      '0007': require('../assets/memory/0007.jpg'),
    };
    this.frontURL = require('../assets/memory/back.jpg');
    const _that = this;
    this.flipCard = function () {
      if (_that.lockBoard) return;
      if (this === _that.firstCard) return;
      this.classList.add('flip');
      if (_that.hasFlippedCard == false) {
        _that.hasFlippedCard = true;
        _that.firstCard = this;
        return;
      }
      _that.secondCard = this;
      _that.matchCard();
    }
  }

  mixSuits(suits) {
    return suits.sort(() => { return .5 - Math.random() });
  }

  createCards() {
    this.newSuits.map((newSuits, i) => {
      let card = document.createElement('div');
      let img_front = document.createElement('img');
      let img_back = document.createElement('img');
      card.className = 'card';
      card.addEventListener('click', this.flipCard);
      card.id = (`${i}`);
      card.name = `${newSuits}`;
      memory.prepend(card);
      img_back.className = 'back';
      img_back.src = this.backURLs[newSuits];
      img_front.className = 'front';
      img_front.src = this.frontURL;
      card.prepend(img_back, img_front);
    })
  }

  unflipCard() {
    this.lockBoard = true;
    setTimeout(() => {
      this.firstCard.classList.remove('flip');
      this.secondCard.classList.remove('flip');
      this.reset();
    }, 750);
  }

  matchCard() {
    this.countTries += 1;
    this.clicksDisplay.innerText = this.countTries;
    if (this.firstCard.name === this.secondCard.name) {
      this.disableCards()
    } else {
      this.unflipCard();
    }
  }

  disableCards() {
    this.firstCard.removeEventListener('click', this.flipCard);
    this.secondCard.removeEventListener('click', this.flipCard);
    this.countPairs += 1;
    this.win();
    this.reset();
  }

  reset() {
    this.hasFlippedCard = false;
    this.lockBoard = false;
    this.firstCard = null;
    this.secondCard = null;
  }

  win() {
    if (this.countPairs === 8) {
      return true;
    }
    return false;
  }

  getClicks() {
    return this.countTries;
  }
}