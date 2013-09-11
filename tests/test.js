var should = require('chai').should(),
    supertest = require('supertest'),
    api = supertest('http://localhost:3000'),
    testData = {
        _id:            null,
        bernietext:     "This is a best ternie",
        realtext:       "This is a test bernie",
        description:    "We shouldn't see this except during testing"
    },
    updateData = {
        bernietext:     "zzzzzzzz",
        realtext:       "zzzzzzzz",
        description:    "zzzzzzzz"
    },
    inc = require('../include.js');

describe('Bernie Mills REST Api', function() {

    it ('Post a new bernie resource to the base collection', function (done) {
        api.post('/')
        .send(testData)
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function (err, res) {

            if (err) {
                return done(err);
            }

            // store the resulting ID so we can use it later in testing
            testData._id = res.body._id;
            done();

        });
    });

    it ('Post a malformed bernie mills resource', function (done) {
        api.post('/')
        .send({
            bernietext:     '',
            realtext:       '',
            description:    ''
        })
        .expect(400)
        .end(function (err, res) {

            if (err) {
                return done(err);
            }

            done();

        });
    });

    it ('Retrieves a specific bernie mills resource by ID', function (done) {
        api.get('/' + testData._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {

            if (err) {
                return done(err);
            }

            res.body.should.have.property('bernietext');
            res.body.bernietext.should.equal(testData.bernietext);

            res.body.should.have.property('realtext');
            res.body.realtext.should.equal(testData.realtext);

            res.body.should.have.property('description');
            res.body.description.should.equal(testData.description);

            res.body.should.have.property('_id');
            res.body._id.should.equal(testData._id);

            done();
        });
    });

    it ('Fails to retrieve a bernie mills resource with a non-existant ID', function (done) {
        api.get('/' + testData._id + '123')
        .expect(404)
        .end(function (err, res) {

            if (err) {
                return done(err);
            }

            done();
        });
    });

    it ('Attempts to update a single bernie mills resource with invalid credentials', function (done) {
        api.put('/' + testData._id)
        .set('x-api-key', 'not-the-right-key')
        .send(updateData)
        .expect(403)
        .end(function (err, res) {

            if (err) {
                return done(err);
            }

            done();
        })
    });

    it ('Attempts to update a single bernie mills resource with missing credentials', function (done) {
        api.put('/' + testData._id)
        .send(updateData)
        .expect(403)
        .end(function (err, res) {

            if (err) {
                return done(err);
            }

            done();
        })
    });

    it ('Successfully updates a single bernie mills resource', function (done) {
        api.put('/' + testData._id)
        .set('x-api-key', inc.apiKey)
        .send(updateData)
        .expect(204)
        .end(function (err, res) {

            if (err) {
                return done(err);
            }

            done();
        })
    });

    it ('Retrieves a list of all bernie mills', function (done) {
        api.get('/')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
            if (err) {
                return done(err);
            }
            res.body.should.be.a('array');

            var record = res.body.pop();

            record.should.have.property('bernietext');
            record.bernietext.should.equal(updateData.bernietext);
            
            record.should.have.property('realtext');
            record.realtext.should.equal(updateData.realtext);
            
            record.should.have.property('description');
            record.description.should.equal(updateData.description);
            
            record.should.have.property('_id');
            record._id.should.equal(testData._id);
            
            done();
        });
    });

    it ('Delete request with incorrect credentials', function (done) {
        api.del('/' + testData._id)
        .set('x-api-key', 'not-the-right-key')
        .expect(403)
        .end(function (err, res) {

            if (err) {
                return done(err);
            }

            done();
        });
    });

    it ('Delete request without the necessary credentials', function (done) {
        api.del('/' + testData._id)
        .expect(403)
        .end(function (err, res) {

            if (err) {
                return done(err);
            }

            done();
        });
    });

    it ('Deletes a specific bernie mills resource with the given ID', function (done) {
        api.del('/' + testData._id)
        .set('x-api-key', inc.apiKey)
        .expect(204)
        .end(function (err, res) {

            if (err) {
                return done(err);
            }

            done();
        });
    });
 
});
