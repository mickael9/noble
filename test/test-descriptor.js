require('should');
const sinon = require('sinon');

const Descriptor = require('../lib/descriptor');

describe('Descriptor', function() {
  let mockNoble = null;
  const mockPeripheralId = 'mock-peripheral-id';
  const mockServiceUuid = 'mock-service-uuid';
  const mockCharacteristicUuid = 'mock-characteristic-uuid';
  const mockUuid = 'mock-uuid';

  let descriptor = null;

  beforeEach(function() {
    mockNoble = {
      readValue: sinon.spy(),
      writeValue: sinon.spy()
    };

    descriptor = new Descriptor(mockNoble, mockPeripheralId, mockServiceUuid, mockCharacteristicUuid, mockUuid);
  });

  afterEach(function() {
    descriptor = null;
  });

  it('should have a uuid', function() {
    descriptor.uuid.should.equal(mockUuid);
  });

  it('should lookup name and type by uuid', function() {
    descriptor = new Descriptor(mockNoble, mockPeripheralId, mockServiceUuid, mockCharacteristicUuid, '2900');

    descriptor.name.should.equal('Characteristic Extended Properties');
    descriptor.type.should.equal('org.bluetooth.descriptor.gatt.characteristic_extended_properties');
  });

  describe('toString', function() {
    it('should be uuid, name, type', function() {
      descriptor.toString().should.equal('{"uuid":"mock-uuid","name":null,"type":null}');
    });
  });

  describe('readValue', function() {
    it('should delegate to noble', function() {
      descriptor.readValue();

      mockNoble.readValue.calledWithExactly(mockPeripheralId, mockServiceUuid, mockCharacteristicUuid, mockUuid).should.equal(true);
    });

    it('should callback', function(done) {
      descriptor.readValue(function() {
        done();
      });
      descriptor.emit('valueRead');
    });

    it('should not call callback twice', function(done) {
      let calledback = 0;

      descriptor.readValue(function() {
        calledback += 1;

      });
      descriptor.emit('valueRead');
      descriptor.emit('valueRead');

      setTimeout(() => {
        calledback.should.equal(1);
        done();
      }, 100);
    });

    it('should callback with error, data', function(done) {
      const mockData = Buffer.alloc(0);

      descriptor.readValue(function(error, data) {
        data.should.equal(mockData);

        done();
      });
      descriptor.emit('valueRead', mockData);
    });

    it('should return a promise', function(done) {
      const mockData = Buffer.alloc(0);

      descriptor.readValue().then(function(data) {
        data.should.equal(mockData);

        done();
      });
      descriptor.emit('valueRead', mockData);
    });
  });

  describe('writeValue', function() {
    let mockData = null;

    beforeEach(function() {
      mockData = Buffer.alloc(0);
    });

    it('should only accept data as a buffer', function() {
      mockData = {};

      (function(){
        descriptor.writeValue(mockData);
      }).should.throwError('data must be a Buffer');
    });

    it('should delegate to noble', function() {
      descriptor.writeValue(mockData);

      mockNoble.writeValue.calledWithExactly(mockPeripheralId, mockServiceUuid, mockCharacteristicUuid, mockUuid, mockData).should.equal(true);
    });

    it('should callback', function(done) {
      descriptor.writeValue(mockData, function() {
        done();
      });
      descriptor.emit('valueWrite');
    });

    it('should not call callback twice', function(done) {
      let calledback = 0;

      descriptor.writeValue(mockData, function() {
        calledback += 1;
      });
      descriptor.emit('valueWrite');
      descriptor.emit('valueWrite');

      setTimeout(() => {
        calledback.should.equal(1);
        done();
      }, 100);
    });

    it('should return a promise', function(done) {
      descriptor.writeValue(mockData).then(function() {
        done();
      });
      descriptor.emit('valueWrite');
    });
  });
});
