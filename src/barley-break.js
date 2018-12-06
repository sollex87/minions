export default function BarleyBreak(context, cellSize) {
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
        console.log('move');
        let nullX = this.getNullCell().x;
        let nullY = this.getNullCell().y;
        console.log(x, y);
        console.log(nullX, nullY);
        console.log(x - 1 == nullX);
        console.log(x + 1 == nullX);
        console.log(y == nullY);
        console.log('final1', (x - 1 == nullX || x + 1 == nullX) && y == nullY);
        console.log(y - 1 == nullY);
        console.log(y + 1 == nullY);
        console.log(x == nullX);
        console.log('final2', (y - 1 == nullY || y + 1 == nullY) && x == nullX);
        if (((x - 1 == nullX || x + 1 == nullX) && y == nullY) || ((y - 1 == nullY || y + 1 == nullY) && x == nullX)) {
            arr[nullY][nullX] = arr[y][x];
            arr[y][x] = 0;
            clicks++;
            console.log('moved');
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
        console.log('mix');
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