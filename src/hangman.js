export default class Hangman {
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
        this.triesCount = 7;
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
        this.dudes = new Image();
        this.dudes.src = require('../assets/hangman.jpg');
        this.dudes.onload = () => {
            if (this.triesCount > 0) {
                this.context.drawImage(this.dudes, 0, ((7 - this.triesCount) * 20), this.canvas.width, this.canvas.height);
            } else {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        };
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