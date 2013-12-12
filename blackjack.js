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

    var cards = _player.cards.map(function (card, n) {
      if(!i || i === 1 || n) return card.card;
      return "Facedown";
    }).join(' ');

    console.log(name + ": " + cards);
  });

  console.log("\n");
});

dealer.on('turn', function () {
  console.log("Dealer's turn.");
});

dealer.on('hit', function () {
  console.log("dealer hits.");
});

dealer.on('stay', function () {
  console.log("dealer stays.");
});

player.on('turn', function () {
  console.log("Your turn.");

  console.log("your cards: "+player.cards.map(function (card) {
    return card.card;
  }).join(' '));

  console.log("dealers cards: "+dealer.cards.map(function (card) {
    return card.card;
  }).join(' '));

  console.log("would you like to (h)it or (s)tay?");

  getCommand(function (input) {
    if(input === 'h' || input === 'hit') return player.hit();
    if(input === 's' || input === 'stay') return player.stay();
  });

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

  var input = ""

  process.stdin.on('data', function(chunk) {
    input += chunk;
  });

  process.stdin.on('end', function() {
    fn(input);
    process.stdin.pause();
  });
}