const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNotesHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNotes = {
    id,
    title,
    createdAt,
    updatedAt,
    tags,
    body,
  };

  notes.push(newNotes);

  const isSuccess = notes.filter((item) => item.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;

  const index = notes.findIndex((item) => item.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt: new Date().toISOString,
    };

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diupdate',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'gagal memperbarui note',
  });
  response.code(404);
  return response;
};

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((item) => item.id === id);

  if (note !== undefined) {
    return {
      status: 'success',
      data: { note },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });

  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  console.log('ID>>>', id);

  const index = notes.findIndex((item) => item.id === id);

  console.log('index>>>', index);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan Berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNotesHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  deleteNoteByIdHandler,
  editNoteByIdHandler,
};
