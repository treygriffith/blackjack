// house hits until 17, stays
// 52 card deck, every game has a new deck
// stay hit user interface

var Game = require('./lib/game');

function playGame() { 

  var game = new Game(2)
    , dealer = game.players[0]
    , player = game.players[1];


  game.on('deal', function() {
    console.log("cards dealt");

    game.players.forEach(function (_player, i) {
      var name = i ? "Player "+i : "Dealer";

      console.log(name + ": " + _player.cardString(i === 0));
    });
    console.log("");
  });

  dealer.on('turn', function () {
    console.log("Dealer's turn.");
    console.log(dealer.cardString());
  });

  dealer.on('hit', function () {
    console.log("dealer hits.");
  });

  dealer.on('stay', function () {
    console.log("dealer stays.");
  });

  dealer.on('bust', function () {
    console.log("dealer busted!");
  });

  player.on('turn', function (fn) {
    console.log("Your turn.");

    console.log("your cards: "+player.cardString());

    console.log("dealers cards: "+dealer.cardString(true));

    console.log("would you like to (h)it or (s)tay?");

    getCommand(function (input) {
      input = input.trim();
      if(input === 'h' || input === 'hit') return player.hit(fn);
      if(input === 's' || input === 'stay') return player.stay(fn);
    });

  });

  player.on('hit', function () {
    console.log("you hit.");
  });
  player.on('stay', function () {
    console.log("you stay.");
  });

  player.on('bust', function () {
    console.log("you busted!");
  });

  player.on('end', function () {
    if(player.won) {
      console.log("You won!");
    } else {
      console.log("You lost.");
    }

    console.log("your cards: "+player.cardString());
    console.log("dealer cards: "+dealer.cardString());

    console.log("\nPlay again? (y/n)");

    getCommand(function (input) {
      input = input.trim();
      if(input === 'y') return playGame();
      process.exit();
    });
  });


  game.start();
}

playGame();




// command line utils
function getCommand(fn) {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  process.stdin.once('data', function(chunk) {
    fn(chunk);
  });
}
