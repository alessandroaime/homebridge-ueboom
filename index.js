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
  // this.stateful = true;
  this.reverse = false;
  this.time = 1000;
  this.speaker = config.speaker;
  this.host = config.host;
  this._service = new Service.Speaker(this.name);

  this.cacheDirectory = HomebridgeAPI.user.persistPath();
  this.storage = require('node-persist');
  this.storage.initSync({
    dir: this.cacheDirectory,
    forgiveParseErrors: true
  });

  this._service.getCharacteristic(Characteristic.Active).on('set', this._setActive.bind(this));
  this._service.getCharacteristic(Characteristic.Mute).on('set', this._setMute.bind(this));
  this._service.getCharacteristic(Characteristic.Mute).on('get', this._getMute.bind(this));

  var cachedState = this.storage.getItemSync(this.name);
  if ((cachedState === undefined) || (cachedState === false)) {
    this._service.setCharacteristic(Characteristic.Active, false);
  } else {
    this._service.setCharacteristic(Characteristic.Active, true);
  }
}

UEBoomSpeaker.prototype.getServices = function() {
  var informationService = new Service.AccessoryInformation();
  informationService.setCharacteristic(Characteristic.Manufacturer, "Alessandro Aime")
  informationService.setCharacteristic(Characteristic.Model, "UE Boom")
  informationService.setCharacteristic(Characteristic.SerialNumber, this.speaker);

  this.informationService = informationService;

  return [informationService, this._service];
}

UEBoomSpeaker.prototype._setActive = function(on, callback) {
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

UEBoomSpeaker.prototype._setMute = function(mute, callback) {
  this.log("Setting speaker to " + mute);

  callback();
}

UEBoomSpeaker.prototype._getMute = function() {
  this.log("Getting speaker mute state");

  const currentValue = 1;
  return currentValue;
}
