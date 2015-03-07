'use strict';

http = require '../../index'

describe 'Promisified HTTP module', ->

  PORT = 8000
  server = null
  agent = null

  beforeEach ->
    server = http.createServerAsync (req, res) ->
      res.statusCode = 200
      res.setHeader 'Content-Type', 'text/html'
      res.end()
    server.listen PORT

  afterEach ->
    agent = null
    server.close()

  describe 'interface', ->

    it 'should return promise when server is created', ->
      expect(server).to.have.property('then').and.is.a('function')

    it 'should return promise when server starts listening on selected port', ->
      expect(server.listen PORT).to.have.property('then').and.is.a('function')

    it 'should return promise when server is called to close', ->
      expect(server.close()).to.have.property('then').and.is.a('function')

  describe 'server instance', ->

    beforeEach ->
      agent = request 'http://localhost:' + PORT

    it 'should be an instance of http.Server', ->
      server.then (server) ->
        expect(server).to.be.instanceof(http.Server);

    it 'should listen for requests on selected port when started', ->
      agent.get '/'
        .then (res) -> expect(res).to.have.status 200

    it 'should not accept any connections when closed', ->
      server.close().then -> agent.get '/'
        .then (res) -> expect(res).to.not.exist
        .catch (err) -> expect(err).to.be.instanceof(Error).and.have.property 'code', 'ECONNREFUSED'

  describe 'node "http" module Server', ->

    it 'has not been altered', ->
      expect(http.Server.prototype).to.not.equal(http.ServerPromisified.prototype);







