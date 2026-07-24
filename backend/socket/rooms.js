export const handleRoomEvents = (io, socket) => {
  // Join a specific book's room
  socket.on('join_book_room', async (openLibraryId) => {
    const roomName = `book_${openLibraryId}`;
    socket.join(roomName);
    
    // Broadcast presence update
    const sockets = await io.in(roomName).fetchSockets();
    io.to(roomName).emit('room_presence_update', {
      openLibraryId,
      readersCount: sockets.length
    });
  });

  // Leave a specific book's room
  socket.on('leave_book_room', async (openLibraryId) => {
    const roomName = `book_${openLibraryId}`;
    socket.leave(roomName);

    // Broadcast presence update
    const sockets = await io.in(roomName).fetchSockets();
    io.to(roomName).emit('room_presence_update', {
      openLibraryId,
      readersCount: sockets.length
    });
  });

  // Automatically handle disconnecting from all rooms
  socket.on('disconnecting', async () => {
    for (const room of socket.rooms) {
      if (room.startsWith('book_')) {
        const sockets = await io.in(room).fetchSockets();
        // Sockets length includes the disconnecting socket, so subtract 1
        io.to(room).emit('room_presence_update', {
          openLibraryId: room.replace('book_', ''),
          readersCount: Math.max(0, sockets.length - 1)
        });
      }
    }
  });
};
