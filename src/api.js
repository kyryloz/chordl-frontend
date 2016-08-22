const backend = 'http://0.0.0.0:8081/api';

module.exports = {
    performers: backend + '/performers/',
    songs: backend + '/songs',
    search: backend + '/search/',
    index: backend + '/index'
};