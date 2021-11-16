function newGame () {
    let game = {
        mineCount: 40,
        generateMines: function() {
            let mineCollection = [];
            while (mineCollection.length < 40) {
                let minePosition = [];
                for (let j = 0; j < 2; j++) {
                    let randomPosition = Math.floor(Math.random() * 16);
                    minePosition.push(randomPosition);
                }
                if (mineCollection.indexOf(minePosition) === -1) {
                    mineCollection.push(minePosition);
                }
            }
            return mineCollection;
        }
    }
    return game;
}

const xPosition = document.getElementsByClassName('column');
console.log(xPosition);
// const yPosition = xPosition[0].children;
let test = document.getElementById('column1');
console.log(test);
let yTest = test.children;

let game = newGame();
let mineArray = game.generateMines();
console.log(mineArray);