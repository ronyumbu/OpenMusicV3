const autoBind = require('auto-bind');

class AlbumLikesHandler {
  constructor(service, albumsService) {
    this._service = service;
    this._albumsService = albumsService;
    autoBind(this);
  }

  // Menambahkan like pada album
  async postAlbumLikeHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const albumId = request.params.id;
    await this._service.addAlbumLike(credentialId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Like pada Album berhasil ditambahkan',
    }).code(201);
    return response;
  }

  // Mendapatkan informasi like pada album berdasarkan ID
  async getAlbumLikeByIdHandler(request, h) {
    const albumId = request.params.id;
    const likesData = await this._service.getAlbumLikeById(albumId);
    const { likesCount, source } = likesData;
    const tempLikeCount = JSON.parse(likesCount);

    const response = h.response({
      status: 'success',
      data: {
        likes: tempLikeCount,
      },
    }).header('X-Data-Source', source);
    return response;
  }

  // Mendapatkan jumlah like pada album
  async getLikeAlbumHandler(request, h) {
    const { albumId } = request.params;
    const { likes, isCache = 0 } = await this._service.getLikeAlbum(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes: likes.length,
      },
    }).code(200);

    if (isCache) response.header('X-Data-Source', 'cache');
    return response;
  }

  // Menghapus like pada album
  async deleteAlbumLikeByIdHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const albumId = request.params.id;
    await this._service.deleteAlbumLike(credentialId, albumId);

    return {
      status: 'success',
      message: 'Like pada Album berhasil dihapus',
    };
  }
}

module.exports = AlbumLikesHandler;
