const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '3.0.0',
  register: async (server, {ProducerService: producerService, playlistsService, validator}) => {
    const exportsHandler = new ExportsHandler(
      producerService,
      playlistsService,
      validator);
    server.route(routes(exportsHandler));
  },
};
