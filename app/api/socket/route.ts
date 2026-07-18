import { createSocketHandler } from 'next-socket.io-handler';

const handler = createSocketHandler((io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('make-move', ({ roomId, board }) => {
      socket.to(roomId).emit('update-board', board);
    });

    socket.on('reset-game', (roomId) => {
      socket.to(roomId).emit('reset-board');
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
});

export const GET = handler;
export const POST = handler;
