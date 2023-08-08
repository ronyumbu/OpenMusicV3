const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  // menambahkan lagu
  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const songId = await this._service.addSong(request.payload);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    }).code(201);
    return response;
  }

  // mendappatkan lagu
  async getSongsHandler(request, h) {
    const { title, performer } = request.query;
    const songs = await this._service.getSongs(title, performer);

    const response = h.response({
      status: 'success',
      data: {
        songs: songs.map((s) => ({
          id: s.id,
          title: s.title,
          performer: s.performer,
        })),
      },
    }).code(200);
    return response;
  }

  // mendapatkan lagu berdasarkan ID
  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  // memperbaharui lagu berdasarkan ID
  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    await this._service.editSongById(id, request.payload);

    return {
      status: 'success',
      message: 'Lagu berhasil diperbaharui',
    };
  }

  // menghapus lagu berdasarkan ID
  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
