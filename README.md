# utbc2019-hw-04-crystal-collector

This week I'm implementing "Crystals Collector", a simple number guessing game which updates the DOM dynamically using jQuery. Players click on crystals with associated values to accumulate a score which matches a random target value.

## Release 1.0 (MVP)

I'm really scraping by with the bare minimum on the user interface this time since I only had a few hours to knock this out, but the structure of the code behind the scenes is pretty clean and scalable.

![alt tag](docs/img/screen-shot.png)

The styling is brilliantly bad in a liberating way but it does match the specification, mostly. No effort is made toward responsiveness. Alert observers will notice I nabbed the artwork for the gems from a still image in the specification which happened to include a hand pointer on the yellow gem. This is now a kitchy fixture in my game since I didn't photoshop it out. :-)

![alt tag](docs/img/gems.png)

## Implementation Features

- MVC software pattern.

- jQuery to update the DOM.

- The crystals are added on the fly and include frontend html elements with data-index attributes which map to an array of crystals owned by the game model on the backend. This enables crystal click events to trigger look-ups of the random value associated with a crystal object in the model and update the current score accordingly. Care is taken to bind event listeners at a document level so they can flow and find the dynamically added crystal elements that would otherwise be unknown to the DOM at load time.

```javascript
Controller.prototype.addCrystals = function() {
  for (let c of this.gameObj.crystals) {
    $(this.crystalParentId).append(
      `<a href="#" class="crystal" id="crystal-${c.index}" data-index="${
        c.index
      }"><img src="${c.imgSrc}"></a>`
    );
    $(document).on("click", `#crystal-${c.index}`, this.getCrystalCallback());
  }
};

Controller.prototype.getCrystalCallback = function() {
  let that = this;
  function crystalCallback(e) {
    let crystalIndex = parseInt($(this).attr("data-index"));
    that.takeTurn(crystalIndex);
  }
  return crystalCallback;
};
```

- Object oriented decomposition:

  - [Game](https://github.com/zenglenn42/utbc2019-hw-04-crystal-collector/blob/e98776d2cf56c8e5af537e9af54434f9aa04d603/assets/js/model.js#L4)

    - This knows about wins, losses, and scores.

  - [CrystalCollector Game](https://github.com/zenglenn42/utbc2019-hw-04-crystal-collector/blob/e98776d2cf56c8e5af537e9af54434f9aa04d603/assets/js/model.js#L38)

    - This inherits from Game and knows how to play the game and take a turn.

  - [Crystal](https://github.com/zenglenn42/utbc2019-hw-04-crystal-collector/blob/e98776d2cf56c8e5af537e9af54434f9aa04d603/assets/js/model.js#L113)

    - This associates a gem image with an object that can randomize a value. An array of these is owned by the CrystalCollector Game. Crystal values are randomized whenever the game's reset method is called (after a round of play).

  - [Controller](https://github.com/zenglenn42/utbc2019-hw-04-crystal-collector/blob/e98776d2cf56c8e5af537e9af54434f9aa04d603/assets/js/controller.js#L7)
    - This mediates data flow between the user interface and game objects.

Surprisingly little integration debugging was required, but my world was rocked a bit during unit test of the CrystalCollector model. It looks like chrome's console performs a live evaluation of object content.

This threw me off because I would newly instantiate the game object, dump it to the console, mutate the object, then console log again. But drilling down into both before-and-after objects within the inspector yielded only the /mutated/ object values in both cases!

The lesson is that console log does not necessarily reflect an object's history of change over time. I need to dig into this more as I'm unsure if this relates more to the shared aspect of an object's prototype area across all instances versus some tooling behaviour unique to chrome's inspector.

Setting a breakpoint before mutation reassured me that the object did in fact transition from it's initial value to it's mutated value as desired.
