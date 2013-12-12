// house hits until 17, stays
// 52 card deck, every game has a new deck
// stay hit user interface

var Game = require('./lib/game');

var game = new Game(2)
  , dealer = game.players[0]
  , player = game.players[1];


game.on('deal', function() {
  console.log("cards dealt");

  game.players.forEach(function (_player, i) {
    var name = i ? "Player "+i : "Dealer";

    console.log(name + ": " + _player.cardString(i > 1));
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

player.on('turn', function (fn) {
  console.log("Your turn.");

  console.log("your cards: "+player.cardString());

  console.log("dealers cards: "+dealer.cardString());

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

player.on('end', function () {
  if(player.won) {
    return console.log("You won!");
  }

  console.log("You lost.");
});


game.start();




// command line utils
function getCommand(fn) {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  process.stdin.on('data', function(chunk) {
    fn(chunk);
  });
}