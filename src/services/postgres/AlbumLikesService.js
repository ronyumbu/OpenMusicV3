const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  // menambahkan like pada album
  async addAlbumLike(userId, albumId) {
    const id = `album-like-${nanoid(16)}`;
    const checkAlbumQuery = {
      text: 'SELECT * from albums WHERE id = $1',
      values: [albumId]
    }

    const resultAlbumQuery = await this._pool.query(checkAlbumQuery);
    if (!resultAlbumQuery.rows.length) {
      throw new NotFoundError('Album like gagal ditambahkan, karena album tidak ditemukan');
    }

    const checkAlbumLikes = {
      text: 'SELECT * from user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId]
    }

    const resultCheckAlbumLikes = await this._pool.query(checkAlbumLikes);
    if (resultCheckAlbumLikes.rowCount >= 1) {
      throw new InvariantError('Album Likes gagal ditambahkan, Album sudah di-Like');
    }

    const query = {
      text: 'INSERT INTO user_album_likes VALUES ($1, $2, $3) RETURNING id',
      values: [id, userId, albumId]
    }

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Album Likes gagal ditambahkan');
    }
    await this._cacheService.delete(`album:${albumId}`);
    return result.rows[0].id;
  }

  // menghapus like album
  async deleteAlbumLike(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId]
    }

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Album Likes gagal dihapus');
    }
    await this._cacheService.delete(`album:${albumId}`);
  }

  // mendapatkan like album berdasarkan ID
  async getAlbumLikeById(albumId) {
    try {
      const result = await this._cacheService.get(`album:${albumId}`);
      return {
        likesCount: JSON.parse(result),
        source: 'cache'
      };
    } catch (error) {
      const query = {
        text: `SELECT COUNT(id)
        FROM user_album_likes
        WHERE album_id = $1`,
        values: [albumId]
      };

      const result = await this._pool.query(query);
      const likesCount = result.rows[0].count;
      await this._cacheService.set(`album:${albumId}`, JSON.stringify(likesCount));
      return {
        likesCount,
        source: 'db'
      };
    }
  }
}

module.exports = AlbumLikesService;