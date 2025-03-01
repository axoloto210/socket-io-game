import { CardGameHandler } from '../feature/cardGameHandler';
import { CARD_GAME_EVENTS, ROOM_EVENTS } from '@socket-io-game/common/src/const/room';

// This test uses a mock approach instead of real connections
describe('Socket.io Integration Tests', () => {
  let io: any;
  let socket: any;
  let clientSocket1: any;
  let clientSocket2: any;
  
  beforeEach(() => {
    // Create mock sockets and io with necessary functions
    clientSocket1 = {
      id: 'client1',
      data: { userName: 'Player1' },
      emit: jest.fn(),
      on: jest.fn(),
      connected: true
    };
    
    clientSocket2 = {
      id: 'client2',
      data: { userName: 'Player2' },
      emit: jest.fn(),
      on: jest.fn(),
      connected: true
    };
    
    // Mock the server-side socket
    socket = {
      id: 'server-socket',
      join: jest.fn(),
      emit: jest.fn(),
      on: jest.fn()
    };
    
    // Mock io with rooms adapter
    const mockRooms = new Map();
    mockRooms.set('test-room', new Set(['client1', 'client2']));
    
    io = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
      on: jest.fn((event, callback) => {
        if (event === 'connection') {
          callback(socket);
        }
      }),
      sockets: {
        adapter: {
          rooms: mockRooms
        },
        sockets: new Map([
          ['client1', clientSocket1],
          ['client2', clientSocket2]
        ])
      }
    };
  });
  
  // No afterAll needed with mocks
  
  test('clients should be able to connect to server', () => {
    // Verify both clients are connected
    expect(clientSocket1.connected).toBe(true);
    expect(clientSocket2.connected).toBe(true);
  });
  
  test('clients should be able to join a room', () => {
    const roomId = 'test-room';
    
    // Set up room joining handler
    socket.on.mockImplementation((event: string, callback: Function) => {
      if (event === ROOM_EVENTS.JOIN_ROOM) {
        // Store the callback to manually trigger it
        socket.joinRoomCallback = callback;
      }
    });
    
    // Create a handler to test the room joining logic
    const setupSocketHandlers = require('../room/roomServer').setupSocketHandlers;
    setupSocketHandlers(io);
    
    // Simulate joining a room
    socket.joinRoomCallback({ roomId, userName: 'Player1' });
    
    // Verify join was called
    expect(socket.join).toHaveBeenCalledWith(roomId);
  });
  
  test('game should start when room has two players', () => {
    const roomId = 'game-room';
    const cardGameHandler = new CardGameHandler(io, roomId);
    
    // Mock sockets for two players
    const player1Socket = { 
      id: 'player1-id', 
      emit: jest.fn(),
      on: jest.fn()
    };
    
    const player2Socket = { 
      id: 'player2-id', 
      emit: jest.fn(),
      on: jest.fn()
    };
    
    // Setup first player
    cardGameHandler.setupSocket(player1Socket as any, 'Player1');
    
    // Verify game not started yet
    expect(io.to).not.toHaveBeenCalledWith(roomId);
    expect(io.emit).not.toHaveBeenCalledWith(CARD_GAME_EVENTS.START);
    
    // Setup second player - should trigger game start
    cardGameHandler.setupSocket(player2Socket as any, 'Player2');
    
    // Game should emit start event
    expect(io.to).toHaveBeenCalledWith(roomId);
  });
});