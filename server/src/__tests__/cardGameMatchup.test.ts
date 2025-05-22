import { ALL_ITEMS } from '@socket-io-game/common';
import { CardGameHandler } from '../feature/cardGameHandler';


describe('Card Game Matchups', () => {
  let io: any;
  let cardGameHandler: CardGameHandler;
  const roomId = 'test-room';
  
  beforeEach(() => {
    // Create mock IO server
    io = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    };
    
    cardGameHandler = new CardGameHandler({io, roomId});
  });
  
  test('High card beats low card in normal condition', () => {
    // Test the card battle logic from the handler
    const mockSocket1 = { id: 'player1-socket-id', emit: jest.fn(), on: jest.fn() } as any;
    const mockSocket2 = { id: 'player2-socket-id', emit: jest.fn(), on: jest.fn() } as any;
    
    // Setup players
    cardGameHandler.setupSocket(mockSocket1, 'Player 1');
    cardGameHandler.setupSocket(mockSocket2, 'Player 2');
    
    // Access private method for testing (need to cast to any)
    const isFirstPlayerWin = (cardGameHandler as any).isFirstPlayerWin.bind(cardGameHandler);
    
    // Test with card values: player1=5 vs player2=1
    const result = isFirstPlayerWin({
      firstPlayerSelectedCard: { cardId: 5, power: 5 },
      secondPlayerSelectedCard: { cardId: 1, power: 1 },
      firstPlayerSelectedItem: undefined,
      secondPlayerSelectedItem: undefined
    });
    
    // Player 1 should win
    expect(result).toBe(true);
  });
  
  test('Abekobe item reverses win conditions', () => {
    // Test the abekobe (reverse) item effect
    const mockSocket1 = { id: 'player1-socket-id', emit: jest.fn(), on: jest.fn() } as any;
    const mockSocket2 = { id: 'player2-socket-id', emit: jest.fn(), on: jest.fn() } as any;
    
    // Setup players
    cardGameHandler.setupSocket(mockSocket1, 'Player 1');
    cardGameHandler.setupSocket(mockSocket2, 'Player 2');
    
    // Access private method for testing
    const isFirstPlayerWin = (cardGameHandler as any).isFirstPlayerWin.bind(cardGameHandler);
    
    // Create an abekobe item
    const abekobe = ALL_ITEMS.ABEKOBE;
    
    // Test with player1=1 vs player2=5, but player1 has abekobe (reverse) item
    const result = isFirstPlayerWin({
      firstPlayerSelectedCard: { cardId: 1, power: 1 },
      secondPlayerSelectedCard: { cardId: 5, power: 5 },
      firstPlayerSelectedItem: abekobe,
      secondPlayerSelectedItem: undefined
    });
    
    // Player 1 should win because abekobe reverses the win condition
    expect(result).toBe(true);
  });
  
  test('Same-value cards result in draw damage to both players', () => {
    // Import Items for draw logic
    const Items = require('../feature/Items').Items;
    
    // Create test items instance
    const items = new Items();
    
    // Test normal draw (both take 1 damage)
    const normalResult = items.getDrawBasePoint(1, undefined, undefined);
    expect(normalResult.player1BasePoint).toBe(1);
    expect(normalResult.player2BasePoint).toBe(1);
  });
});