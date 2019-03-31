//
// Define controller object which updates the display based upon
// incoming events triggered by user activity with data maintained by
// the backend game model.
//

function Controller(helpId, targetValueId, winsId, lossesId, crystalParentId, scoreId) { 
    this.gameObj = new CrystalCollector();
    this.helpId = helpId;
    this.targetValueId = targetValueId;
    this.winsId = winsId;
    this.lossesId = lossesId;
    this.crystalParentId = crystalParentId;
    this.scoreId = scoreId;
    this.displayHelp();
    this.addCrystals(); // adds event listeners
    this.updateDisplay();
    this.gameObj.state = "playing";
}

Controller.prototype.reset = function() {
    this.gameObj.reset();
    this.updateDisplay();
    this.gameObj.state = "playing";
}

Controller.prototype.takeTurn = function(crystalIndex) {
    console.log("Controller.takeTurn");
    let state = this.gameObj.takeTurn(crystalIndex);
    this.displayScore();
    if (state === "won" || state === "lost") {
        // Start a new round of play with a different
        // target value and hidden crystal values.
        this.reset();
    }
}

Controller.prototype.addCrystals = function() {
    for (let c of this.gameObj.crystals) {
        $(this.crystalParentId).append(
            `<a href="#" class="crystal" id="crystal-${c.index}" data-index="${c.index}"><img src="${c.imgSrc}"></a>`
        );
        $(document).on("click", `#crystal-${c.index}`, this.getCrystalCallback());
    }
}

Controller.prototype.getCrystalCallback = function() {
    let that = this;
    function crystalCallback(e) {
        let crystalIndex = parseInt($(this).attr("data-index"));
        that.takeTurn(crystalIndex);
    }
    return crystalCallback;
}

Controller.prototype.updateDisplay = function() {
    this.displayTargetValue();
    this.displayWins();
    this.displayLosses();
    this.displayScore();
}

Controller.prototype.displayTargetValue = function() {
    let targetValue = this.gameObj.getTargetValue();
    $(this.targetValueId).text(targetValue);
}

Controller.prototype.displayWins = function() {
    let wins = this.gameObj.getWins();
    $(this.winsId).text(wins);
}

Controller.prototype.displayLosses = function() {
    let losses = this.gameObj.getLosses();
    $(this.lossesId).text(losses);
}

Controller.prototype.displayScore = function() {
    let score = this.gameObj.getScore();
    $(this.scoreId).text(score);
}

Controller.prototype.displayHelp = function() {
    let text = this.gameObj.getHelpText();
    $(helpId).html(text);
}