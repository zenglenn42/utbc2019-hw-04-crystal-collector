//---------------------------------------------------------------------------
// Define object model for a generic game.
//---------------------------------------------------------------------------
function Game() { }
Game.prototype.losses = 0;
Game.prototype.wins = 0;
Game.prototype.score = 0;
Game.prototype.name = "Game";
Game.prototype.state = "playing"; // playing|won|lost
Game.prototype.getLosses = function() {
    return this.losses;
}
Game.prototype.incLosses = function() {
        this.losses++;
}
Game.prototype.getWins = function() {
    return this.wins;
}
Game.prototype.incWins = function() {
        this.wins++;
}
Game.prototype.getName = function() {
    return this.name;
}
Game.prototype.getScore = function() {
    return this.score;
}
Game.prototype.reset = function() {
    this.losses = 0;
    this.wins = 0;
    this.score = 0;
    this.state = "playing";
}

//---------------------------------------------------------------------------
// Define object model of CrystalCollector game, a subclass of Game.
//---------------------------------------------------------------------------
function CrystalCollector() {
    this.crystals = [];
    for (let i = 0; i < this.imgSrcArray.length; i++) {
        let c = new Crystal(i, this.imgSrcArray[i]);
        this.crystals.push(c);
    }
    this.targetValue = this.getRandomValue();
}
CrystalCollector.prototype = new Game();
CrystalCollector.prototype.__proto__ = Game.prototype;
CrystalCollector.prototype.name = "Crystal Collector";
CrystalCollector.prototype.imgSrcArray = [
                                "assets/img/red-gem.png", 
                                "assets/img/blue-gem.png", 
                                "assets/img/yellow-gem.png", 
                                "assets/img/green-gem.png"];
CrystalCollector.prototype.targetValue = 0;
CrystalCollector.prototype.targetMinValue = 19
CrystalCollector.prototype.targetMaxValue = 120;
CrystalCollector.prototype.helpText = "\
You will be given a random number at the start of the game.<br \><br \>\
There are four crystals below.  By clicking on a crystal you will add \
a specific amount of points to your total score.<br \><br \>\
You win the game by matching your total score to a random number, \
you lose the game if your total score goes above the random number.<br \>\<br \>\
The value of each crystal is hidden from you until you click on it.<br \><br \>\
Each time the game starts, a new value is assigned to each crystal.<br \><br \>\
";
CrystalCollector.prototype.getHelpText = function() {
    return this.helpText;
}
CrystalCollector.prototype.getTargetValue = function() {
    return this.targetValue;
}
CrystalCollector.prototype.reset = function() {
    this.score = 0;
    this.state = "playing";
    for (let index in this.crystals) {
        this.crystals[index].reset();
    }
    this.targetValue = this.getRandomValue();
}

// Return a random number between [targetMinValue, targetMaxValue]
CrystalCollector.prototype.getRandomValue = function() {
    let delta = this.targetMaxValue - this.targetMinValue;
    return Math.floor(Math.random() * (delta + 1)) + this.targetMinValue;
}

CrystalCollector.prototype.takeTurn = function(crystalIndex) {
    if (this.state === "playing") {
        if (crystalIndex < this.crystals.length) {
            this.score += this.crystals[crystalIndex].getValue();
            if (this.score === this.targetValue) {
                this.state = "won";
                this.incWins();
                console.log(this.state);
            } else if (this.score > this.targetValue) {
                this.state = "lost";
                this.incLosses();
                console.log(this.state);
            }
        } else {
            console.warn("CrystalCollector.takeTurn: crystalIndex out of range:", crystalIndex);
        }
    } else {
        console.warn("CrystalCollector.takeTurn: ignoring, not in playing state");
    }
    return this.state;
}

//---------------------------------------------------------------------------
// Define object model of a single crystal.  These are aggregated by
// the CrystalCollector game.
//---------------------------------------------------------------------------
function Crystal(index, imgSrc) {
    this.index = index;
    this.imgSrc = imgSrc;
    this.value = this.getRandomValue();
}
Crystal.prototype.index = 0;
Crystal.prototype.imgSrc = undefined;
Crystal.prototype.showVal = false;
Crystal.prototype.getValue = function() {
    return this.value;
}
Crystal.prototype.getRandomValue = function() {
    return Math.floor(Math.random() * 12) + 1;  // between 1 - 12
}
Crystal.prototype.reset = function() {
    this.value = this.getRandomValue();
}

//---------------------------------------------------------------------------
function UnitTestModel() {
    let c = new Crystal("assets/img/ruby.png");
    console.log("crystal c = ", c);
    c.reset();
    console.log("crystal c = ", c);

    cc = new CrystalCollector();
    cc.incWins();
    cc.incLosses()
    console.log(cc);
    cc.reset();
    console.log(cc);
    while (cc.state === "playing") {
        for (i = 0; i < cc.crystals.length; i++) {
            let state = cc.takeTurn(i);
            console.log("state = ", state, "  score = ", cc.getScore());
            if (state !== "playing") break;
        }
    }
    console.log(cc.state);
}