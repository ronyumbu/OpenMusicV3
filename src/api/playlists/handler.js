const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(songsService, collaborationsService, service, validator) {
    this._songsService = songsService;
    this._collaborationsService = collaborationsService;
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  // menambahkan playlist
  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({
      name,
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    }).code(201);
    return response;
  }

  // mendapatkan playlist
  async getPlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  // menghapus playlist
  async deletePlaylistHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deletePlaylistById(playlistId);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  // menambahkan lagu ke playlist
  async postSongToPlaylistHandler(request, h) {
    this._validator.validateUpdateSongPlaylistPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const action = 'add';

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._songsService.getSongById(songId);
    await this._service.addSongActivities({
      playlistId,
      songId,
      userId: credentialId,
      action,
    });

    await this._service.addSongToPlaylist(playlistId, songId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    }).code(201);
    return response;
  }

  // mendapatkan lagu dari playlist
  async getSongFromPlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    console.log(`error get ${credentialId} ${playlistId}`);
    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    const playlist = await this._service.getSongsFromPlaylist(playlistId);

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  // menghapus lagu dari playlist
  async deleteSongFromPlaylistHandler(request) {
    this._validator.validateUpdateSongPlaylistPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const action = 'delete';
    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    await this._service.addSongActivities({
      playlistId,
      songId,
      userId: credentialId,
      action,
    });

    await this._service.deleteSongFromPlaylist(playlistId, songId);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  // mendaparkan aktivitas lagu
  async getSongActivitiesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    await this._service.verifyPlaylistAccess(id, credentialId);
    const activities = await this._service.getSongActivities(id);

    const response = h.response({
      status: 'success',
      data: {
        playlistId: id,
        activities,
      },
    }).code(200);
    return response;
  }
}

module.exports = PlaylistsHandler;
