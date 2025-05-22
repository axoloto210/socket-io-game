import { ALL_ITEMS, Card, Item } from '@socket-io-game/common';
import { CardGameHandler } from '../feature/cardGameHandler';
import { Items } from '../feature/items';


describe('Item Effect Matchups', () => {
  let io: any;
  let cardGameHandler: CardGameHandler;
  let items: Items;
  const roomId = 'test-room';
  
  beforeEach(() => {
    // Mock IO server
    io = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    };
    
    cardGameHandler = new CardGameHandler({io, roomId});
    items = new Items();
  });
  
  test('abekobe item should reverse win conditions', () => {
    // Access the private isFirstPlayerWin method 
    const isFirstPlayerWin = (cardGameHandler as any).isFirstPlayerWin.bind(cardGameHandler);
    
    // Create an abekobe (reverse) item
    const abekobe: Item = ALL_ITEMS.ABEKOBE;
    
    // First player has lower card but uses abekobe
    const result = isFirstPlayerWin({
      firstPlayerSelectedCard: { cardId: 1, power: 1 },
      secondPlayerSelectedCard: { cardId: 5, power: 5 },
      firstPlayerSelectedItem: abekobe,
      secondPlayerSelectedItem: undefined
    });
    
    // First player should win despite having lower card value
    expect(result).toBe(true);
  });
  
  test('gusu (even) item should boost even cards', () => {
    // Create cards to test
    const evenCard: Card = { cardId: 2, power: 2 };
    const oddCard: Card = { cardId: 3, power: 3 };
    
    // Copy cards to check results after effect
    const evenCardCopy = { ...evenCard };
    const oddCardCopy = { ...oddCard };
    
    // Apply gusu effect
    items.applyGusuEffect(oddCardCopy, evenCardCopy);
    
    // Even card should get +2 power
    expect(oddCardCopy.power).toBe(oddCard.power); // Unchanged
    expect(evenCardCopy.power).toBe(evenCard.power + 2); // +2 power
  });
  
  test('risky item should apply extra damage when winning', () => {
    // Access private method for testing damage
    const applyDamage = (cardGameHandler as any).applyDamage.bind(cardGameHandler);
    
    // Create risky item
    const riskyItem: Item = ALL_ITEMS.RISKY;
    
    // Create mock player statuses
    const player1Status = { hp: 3, userName: 'Player1', hands: [], items: [] };
    const player2Status = { hp: 3, userName: 'Player2', hands: [], items: [] };
    
    // Player 1 wins with risky item
    applyDamage({
      player1Id: 'player1',
      player2Id: 'player2',
      player1SelectedCard: { cardId: 5, power: 5 },
      player2SelectedCard: { cardId: 1, power: 1 },
      player1SelectedItem: riskyItem,
      player2SelectedItem: undefined,
      player1Status,
      player2Status
    });
    
    // Player 2 should take extra damage
    expect(player1Status.hp).toBe(3); // Unchanged
    expect(player2Status.hp).toBe(1); // Normal damage + extra damage
  });
  
  test('mukou item should nullify opponent item effect', () => {
    // Create items
    const mukouka: Item = ALL_ITEMS.MUKOUKA;
    
    const risky: Item = ALL_ITEMS.RISKY;
    
    // Test mukou nullifies other effects
    expect(items.isMukouEffect(mukouka, risky)).toBe(true);
    
    // Access private method for testing damage with mukou
    const applyDamage = (cardGameHandler as any).applyDamage.bind(cardGameHandler);
    
    // Create mock player statuses
    const player1Status = { hp: 3, userName: 'Player1', hands: [], items: [] };
    const player2Status = { hp: 3, userName: 'Player2', hands: [], items: [] };
    
    // Player 1 wins with risky but player 2 has mukou
    applyDamage({
      player1Id: 'player1',
      player2Id: 'player2',
      player1SelectedCard: { cardId: 5, power: 5 },
      player2SelectedCard: { cardId: 1, power: 1 },
      player1SelectedItem: risky,
      player2SelectedItem: mukouka,
      player1Status,
      player2Status
    });
    
    // Player 2 should take only normal damage (mukou nullifies risky's extra damage)
    expect(player1Status.hp).toBe(3); // Unchanged
    expect(player2Status.hp).toBe(2); // Only normal damage
  });
});