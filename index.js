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

  this.volume = {};
  this.mute = {};

  this.service = new Service.SmartSpeaker(this.name);

  this.cacheDirectory = HomebridgeAPI.user.persistPath();
  this.storage = require('node-persist');
  this.storage.initSync({
    dir: this.cacheDirectory,
    forgiveParseErrors: true
  });

  this.service.getCharacteristic(Characteristic.CurrentMediaState)
    .on("get", this.getCurrentMediaState.bind(this))

  this.service.getCharacteristic(Characteristic.TargetMediaState)
    .on("get", this.getTargetMediaState.bind(this))
    .on("set", this.setTargetMediaState.bind(this));

  /*
  this.service.addCharacteristic(new Characteristic.Volume)
    .on("get", this.getVolume.bind(this))
    .on("set", this.setVolume.bind(this));

  this.service.addCharacteristic(new Characteristic.Active)
    .on("get", this.getActive.bind(this))
    .on("set", this.setActive.bind(this));
  */

  /*
  this.service.getCharacteristic(Characteristic.On).on('set', this._setOn.bind(this));

  var cachedState = this.storage.getItemSync(this.name);
  if ((cachedState === undefined) || (cachedState === false)) {
    this.service.setCharacteristic(Characteristic.On, false);
  } else {
    this.service.setCharacteristic(Characteristic.On, true);
  }
  */
}

UEBoomSpeaker.prototype = {

  getServices: function () {
    this.log("Creating UE Boom speaker...");
    var informationService = new Service.AccessoryInformation();

    informationService
      .setCharacteristic(Characteristic.Manufacturer, "Alessandro Aime")
      .setCharacteristic(Characteristic.Model, "UE Boom")
      .setCharacteristic(Characteristic.SerialNumber, this.speaker);

    return [informationService, this.service];
  },

  getCurrentMediaState: function () {
    return 0;
  },

  getTargetMediaState: function () {
    return 0;
  },

  setTargetMediaState: function (value) {},

  getVolume: function (callback) {},

  setVolume: function (state, callback) {},

  getActive: function (callback) {},

  setActive: function (state, callback) {},

  getServices: function() {
    return [this.service];
  }

}

// See: https://github.com/isklikas/homebridge-http-speaker/blob/master/index.js
// See: https://www.npmjs.com/package/homebridge-multiroom-speaker?activeTab=code

/*

UEBoomSpeaker.prototype.getServices = function() {

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

*/
