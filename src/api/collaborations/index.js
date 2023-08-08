const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '3.0.0',
  register: async (server, {playlistsService, usersService, service, validator}) => {
    const collaborationsHandler = new CollaborationsHandler(
      playlistsService,
      usersService,
      service,
      validator,
    );
    server.route(routes(collaborationsHandler));
  },
};
