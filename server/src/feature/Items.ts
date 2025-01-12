import { Card, Item, PlayerStatus } from "../common/src/types";

export class Items {
  applyGusuEffect(player1SelectedCard: Card, player2SelectedCard: Card) {
    if (player1SelectedCard.power % 2 === 0) {
      player1SelectedCard.power += 2;
    }
    if (player2SelectedCard.power % 2 === 0) {
      player2SelectedCard.power += 2;
    }
  }

  isMukouEffect(player1SelectedItem?:Item, player2SelectedItem?:Item){
    return player1SelectedItem?.itemId === 2 || player2SelectedItem?.itemId === 2
  }

  applyRiskyEffect(playerSelectedCard: Card) {
    playerSelectedCard.power -= 2;
  }

}
