export default class Memory {
  constructor() {
    this.suits = ['0001', '0002', '0003', '0004', '0005', '0006',
      '0007', '0008', '0001', '0002', '0003', '0004', '0005', '0006',
      '0007', '0008',]
    this.newSuits = this.mixSuits(this.suits);
    this.memory = document.getElementById('memory');
    this.clicksDisplay = document.getElementById("span-clicks");
    this.firstCard = null;
    this.secondCard = null;
    this.hasFlippedCard = false;
    this.lockBoard = false;
    this.countTries = 0;
    this.countPairs = 0;
    this.backURLs = {};
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

  getUrls() {
    for (let i = 0; i < this.suits.length / 2; i += 1) {
      if (i < 10) {
        this.backURLs[i] = `../assets/memory/000${i + 1}.jpg`;
      }
      console.log(this.backURLs);
    }
  }

  mixSuits(suits) {
    return suits.sort(() => { return .5 - Math.random() });
  }

  createCards() {
    this.getUrls();
    console.log(this.newSuits);
    console.log(this.frontURL);
    this.newSuits.map((newSuits, i) => {
      console.log(this.frontURL);
      let card = document.createElement('div');
      let img_front = document.createElement('img');
      let img_back = document.createElement('img');
      card.className = 'card';
      card.addEventListener('click', this.flipCard);
      card.id = (`${i}`);
      card.name = `${newSuits}`;
      memory.prepend(card);
      img_back.className = 'back';
      img_back.src = `https://raw.githubusercontent.com/Boardonly/images/master/images/${newSuits}.jpg`;
      img_front.className = 'front';
      img_front.src = this.frontURL;
      card.prepend(img_back, img_front);
    })
  }

  flipCard() {
    if (this.lockBoard) return;
    if (this === this.firstCard) return;
    this.classList.add('flip');
    if (this.hasFlippedCard == false) {
      this.hasFlippedCard = true;
      this.firstCard = this;
      return;
    }
    this.secondCard = this;
    () => matchCard();
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