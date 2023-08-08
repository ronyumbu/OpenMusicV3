const AlbumLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'album_likes',
  version: '3.0.0',
  register: async (server, { service, albumsService }) => {
    const albumLikesHandler = new AlbumLikesHandler(service, albumsService);
    server.route(routes(albumLikesHandler));
  },
};
