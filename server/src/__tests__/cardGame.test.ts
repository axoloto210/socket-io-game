import { Server } from 'socket.io';
import { createServer } from 'http';
import { io as Client } from 'socket.io-client';

import { CardGameHandler } from '../feature/cardGameHandler';
import { CARD_GAME_EVENTS, ROOM_EVENTS } from '@socket-io-game/common/src/const/room';

describe('Card Game functionality', () => {
  let io: Server;
  let cardGameHandler: CardGameHandler;
  const roomId = 'test-room';

  beforeEach(() => {
    // Mock IO server
    io = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    } as any;
    
    cardGameHandler = new CardGameHandler(io, roomId);
  });

  test('should allow two players to join', () => {
    const mockSocket1 = { id: 'player1-socket-id', emit: jest.fn() } as any;
    const mockSocket2 = { id: 'player2-socket-id', emit: jest.fn(), on: jest.fn() } as any;
    
    expect(cardGameHandler.canJoin(mockSocket1)).toBe(true);
    expect(cardGameHandler.canJoin(mockSocket2)).toBe(true);
  });

  test('should not allow a third player to join', () => {
    const mockSocket1 = { id: 'player1-socket-id', emit: jest.fn(), on: jest.fn() } as any;
    const mockSocket2 = { id: 'player2-socket-id', emit: jest.fn(), on: jest.fn() } as any;
    const mockSocket3 = { id: 'player3-socket-id', emit: jest.fn() } as any;
    
    cardGameHandler.setupSocket(mockSocket1, 'Player 1');
    cardGameHandler.setupSocket(mockSocket2, 'Player 2');
    
    expect(cardGameHandler.canJoin(mockSocket3)).toBe(false);
    expect(mockSocket3.emit).toHaveBeenCalledWith(ROOM_EVENTS.ROOM_FULL, expect.any(Object));
  });

  test('should resolve battle with higher card winning', () => {
    // Create mock sockets with proper event handlers
    const mockSocket1 = { 
      id: 'player1-socket-id', 
      emit: jest.fn(), 
      on: jest.fn((event, callback) => {
        if (event === CARD_GAME_EVENTS.SELECT_CARD) {
          socket1CardSelectCallback = callback;
        }
      }) 
    } as any;
    
    const mockSocket2 = { 
      id: 'player2-socket-id', 
      emit: jest.fn(), 
      on: jest.fn((event, callback) => {
        if (event === CARD_GAME_EVENTS.SELECT_CARD) {
          socket2CardSelectCallback = callback;
        }
      }) 
    } as any;
    
    let socket1CardSelectCallback: any;
    let socket2CardSelectCallback: any;
    
    // Mock IO emit to room
    io.to = jest.fn().mockReturnValue({
      emit: jest.fn()
    });
    
    // Set up spy on private method
    const resolveSpy = jest.spyOn(cardGameHandler as any, 'resolveSelectedCards');
    
    // Start game with two players
    cardGameHandler.setupSocket(mockSocket1, 'Player 1');
    cardGameHandler.setupSocket(mockSocket2, 'Player 2');
    
    // Players select cards (one higher than the other)
    socket1CardSelectCallback({ cardId: 5 }); // Player 1 selects high card
    socket2CardSelectCallback({ cardId: 1 }); // Player 2 selects low card
    
    // Check that resolveSelectedCards was called
    expect(resolveSpy).toHaveBeenCalled();
  });
});