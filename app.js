function newGame () {
    let game = {
        mineCount: 40,
        generateMines: function() {
            let mineCollection = [];
            while (mineCollection.length < this.mineCount) {
                let minePosition = [];
                for (let j = 0; j < 2; j++) {
                    let randomPosition = Math.floor(Math.random() * 16);
                    minePosition.push(randomPosition);
                }
                if (this.checkRepeatMine(minePosition, mineCollection)) {
                    mineCollection.push(minePosition);
                }
            }
            return mineCollection;
        },
        checkRepeatMine: function(specificMine, allMines) {
            let isUnique = true;
            for (let i = 0; i < allMines.length; i++) {
                if (specificMine[0] === allMines[i][0] && specificMine[1] === allMines[i][1]) {
                    isUnique = false;
                }
            }
            return isUnique;
        }
    }
    return game;
}

const xPosition = document.getElementsByClassName('column');
console.log(xPosition);

//initialize game
let game = newGame();
let mineArray = game.generateMines();
console.log(mineArray);

//add mines to the playfield
for (i = 0; i < mineArray.length; i++) {
    let minePosition = mineArray[i];
    let minePlacement = xPosition[minePosition[0]].children[minePosition[1]];
    // console.log(columnArray);
    minePlacement.style.backgroundColor = 'red';
}

//test section
