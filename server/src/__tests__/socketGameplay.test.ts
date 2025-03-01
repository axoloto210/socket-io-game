import { CardGameHandler } from '../feature/cardGameHandler';
import { CARD_GAME_EVENTS } from '@socket-io-game/common/src/const/room';

// Test for gameplay logic using mocks
describe('Socket.io Gameplay Test', () => {
  let io: any;
  let socket1: any;
  let socket2: any;
  let cardGameHandler: CardGameHandler;
  const roomId = 'gameplay-test-room';
  
  beforeEach(() => {
    // Create mock sockets for two players
    socket1 = {
      id: 'player1-id',
      emit: jest.fn(),
      on: jest.fn((event: string, callback: Function) => {
        if (event === CARD_GAME_EVENTS.SELECT_CARD) {
          socket1.selectCardCallback = callback;
        }
      })
    };
    
    socket2 = {
      id: 'player2-id',
      emit: jest.fn(),
      on: jest.fn((event: string, callback: Function) => {
        if (event === CARD_GAME_EVENTS.SELECT_CARD) {
          socket2.selectCardCallback = callback;
        }
      })
    };
    
    // Mock IO server
    io = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    };
    
    // Create card game handler
    cardGameHandler = new CardGameHandler(io as any, roomId);
  });
  
  test('card selection should trigger battle resolution', () => {
    // Set up spy on card game handler
    const resolveSpy = jest.spyOn(cardGameHandler as any, 'resolveSelectedCards');
    
    // Setup both players
    cardGameHandler.setupSocket(socket1 as any, 'Player1');
    cardGameHandler.setupSocket(socket2 as any, 'Player2');
    
    // Player 1 selects a high card
    socket1.selectCardCallback({ cardId: 5 });
    
    // Verify game has not resolved yet (waiting for player 2)
    expect(resolveSpy).not.toHaveBeenCalled();
    
    // Player 2 selects a low card
    socket2.selectCardCallback({ cardId: 1 });
    
    // Verify battle resolution was triggered
    expect(resolveSpy).toHaveBeenCalled();
    
    // Game should emit back to the room
    expect(io.to).toHaveBeenCalledWith(roomId);
  });
  
  test('high card should win against low card', () => {
    // Access the private isFirstPlayerWin method for testing
    const isFirstPlayerWin = (cardGameHandler as any).isFirstPlayerWin.bind(cardGameHandler);
    
    // Check high card (5) wins against low card (1)
    const result = isFirstPlayerWin({
      firstPlayerSelectedCard: { cardId: 5, power: 5 },
      secondPlayerSelectedCard: { cardId: 1, power: 1 },
      firstPlayerSelectedItem: undefined,
      secondPlayerSelectedItem: undefined
    });
    
    // Player with higher card should win
    expect(result).toBe(true);
  });
});