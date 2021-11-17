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

const columnCollection = document.getElementsByClassName('column');
console.log(columnCollection);


//initialize game
let game = newGame();
let mineArray = game.generateMines();
console.log(mineArray);

//add mines to the playfield
for (let i = 0; i < mineArray.length; i++) {
    let minePosition = mineArray[i];
    let minePlacement = columnCollection[minePosition[0]].children[minePosition[1]];
    // console.log(columnArray);
    minePlacement.style.backgroundColor = 'red';
    minePlacement.classList.add('mines');
}
//add numbers to playfield
for (let i = 0; i < columnCollection.length; i++) {
    for (let j = 0; j < columnCollection[0].children.length; j++) {
        if (columnCollection[i].children[j].classList.contains('mines')) {
            for (let k = i - 1; k < i + 2; k++) {
                for (let l = j - 1; l < j + 2; l++) {
                    if (k < 0 || k > 15 || l < 0 || l > 15) {
                        continue;
                    }
                    console.log('x value', k, 'y value', l);
                    if (columnCollection[k].children[l].classList.contains('mines')) {
                        continue;
                    }
                    columnCollection[k].children[l].innerText = Number(columnCollection[k].children[l].innerText) + 1;
                }
            }
        }
    }
}
//test section
columnCollection[0].children[0].innerText = Number(columnCollection[0].children[0].innerText) + 1
console.log(columnCollection.length)
