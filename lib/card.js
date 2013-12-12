module.exports = Card;

function Card(suit, card) {
  this.suit = suit;
  this.card = card;
}

Card.prototype.value = function () {
  var val = typeof(this.card) === 'number' ? this.card : 10;

  if(this.card === 'A') {
    return 0;
  }

  return val;
};