// house hits until 17, stays
// 52 card deck, every game has a new deck
// stay hit user interface

var Game = require('./lib/game');

var game = new Game(2)
  , dealer = game.players[0]
  , player = game.players[1];


game.on('deal', function() {
  console.log("cards dealt");

  game.players.forEach(function (player, i) {
    var name = i || "Dealer";

    var cards = player.cards.map(function (card, n) {
      if(!i || n) return card.card;
      return "Facedown";
    }).join(' ');

    console.log(name + ": " + cards);
  });

  console.log("\n");
});

dealer.on('turn', function () {
  console.log("Dealer's turn.");
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