var Service, Characteristic, HomebridgeAPI;
var util = require('util'), exec = require('child_process').exec, child;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  HomebridgeAPI = homebridge;
  homebridge.registerAccessory("homebridge-ueboom", "UEBoomSpeaker", UEBoomSpeaker);
}

function UEBoomSpeaker(log, config) {
  this.log = log;
  this.name = config.name;
  this.stateful = true;
  this.reverse = false;
  this.time = 1000;
  this.speaker = config.speaker;
  this.host = config.host;

  this.service = new Service.Speaker(this.name, "speakerService");

  this.cacheDirectory = HomebridgeAPI.user.persistPath();
  this.storage = require('node-persist');
  this.storage.initSync({
    dir: this.cacheDirectory,
    forgiveParseErrors: true
  });

  this.service.getCharacteristic(Characteristic.On).on('set', this._setOn.bind(this));

  var cachedState = this.storage.getItemSync(this.name);
  if ((cachedState === undefined) || (cachedState === false)) {
    this.service.setCharacteristic(Characteristic.On, false);
  } else {
    this.service.setCharacteristic(Characteristic.On, true);
  }
}

UEBoomSpeaker.prototype = {

  getServices: function () {
    this.log("Creating UE Boom speaker...");
    var informationService = new Service.AccessoryInformation();
  },

  getMuteState: function (callback) {},

  setMuteState: function (state, callback) {},

  getActiveState: function (callback) {},

  setActiveState: function (state, callback) {},

  getPowerState: function (callback) {},

  setPowerState: function (state, callback) {},

}

UEBoomSpeaker.prototype.getServices = function() {
  var informationService = new Service.AccessoryInformation();
  informationService.setCharacteristic(Characteristic.Manufacturer, "Alessandro Aime")
  informationService.setCharacteristic(Characteristic.Model, "UE Boom")
  informationService.setCharacteristic(Characteristic.SerialNumber, this.speaker);

  this.informationService = informationService;

  return [informationService, this.service];
}

UEBoomSpeaker.prototype._setOn = function(on, callback) {
  this.log("Setting speaker to " + on);

  this.storage.setItemSync(this.name, on);

  child = exec(
    "gatttool -i hci0 -b " + this.speaker + " --char-write-req -a 0x0003 -n " + this.host + (on ? "01" : "02"),
    function(error, stdout, stderr) {
      if (error !== null) {
        console.log("stderr: " + stderr);
      }
    }
  );

  callback();
}


//////////

class UEBoomSpeaker {

  constructor(log, config, api) {
      this.log = log;
      this.config = config;
      this.api = api;

      this.log.debug('UEBoomSpeaker Loaded');

      this.guest = config.guest;
      this.host = config.host;

      this.Service = this.api.hap.Service;
      this.Characteristic = this.api.hap.Characteristic;

      this.informationService = new this.api.hap.Service.AccessoryInformation()
        .setCharacteristic(this.api.hap.Characteristic.Manufacturer, "Alessandro Aime")
        .setCharacteristic(this.api.hap.Characteristic.Model, "UE Boom")
        .setCharacteristic(this.api.hap.Characteristic.SerialNumber, this.guest);

      this.name = config.name;

      // this.service = new this.Service(this.Service.Speaker);
      this.speakerService = new this.api.hap.Service.Speaker(this.name);

      this.speakerService.getCharacteristic(this.Characteristic.Active)
        .onGet(this.handleActiveGet.bind(this))
        .onSet(this.handleActiveSet.bind(this));

      this.speakerService.getCharacteristic(this.Characteristic.Mute)
        .onGet(this.handleMuteGet.bind(this))
        .onSet(this.handleMuteSet.bind(this));

  }

  getServices() {
    return [
      this.informationService,
      this.speakerService,
    ];
  }

  handleActiveGet() {
    this.log.debug('Triggered GET Active');

    const currentValue = this.Characteristic.Active.INACTIVE;
    return currentValue;
  }

  handleActiveSet(value) {
    this.log.debug('Triggered SET Active:' + value);

    child = exec(
      "gatttool -i hci0 -b " + this.guest + " --char-write-req -a 0x0003 -n " + this.host + (on ? "01" : "02"),
      function(error, stdout, stderr) {
        if (error !== null) {
          console.log("stderr: " + stderr);
        }
      }
    );
  }

  handleMuteGet() {
    this.log.debug('Triggered GET Mute');

    const currentValue = 1;
    return currentValue;
  }

  handleMuteSet(value) {
    this.log.debug('Triggered SET Mute:' + value);
  }

}
