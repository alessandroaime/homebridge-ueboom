module.exports = (api) => {
  api.registerAccessory("UEBoomSpeaker", UEBoomSpeaker);
  var util = require('util'), exec = require('child_process').exec, child;
};

class UEBoomSpeaker {

  constructor(log, config, api) {
      this.log = log;
      this.config = config;
      this.api = api;

      this.speaker = config.speaker;
      this.host = config.host;

      this.Service = this.api.hap.Service;
      this.Characteristic = this.api.hap.Characteristic;

      this.name = config.name;

      this.service = new this.Service(this.Service.Speaker);

      this.service.getCharacteristic(this.Characteristic.Active)
        .onGet(this.handleActiveGet.bind(this))
        .onSet(this.handleActiveSet.bind(this));

      this.service.getCharacteristic(this.Characteristic.Mute)
        .onGet(this.handleMuteGet.bind(this))
        .onSet(this.handleMuteSet.bind(this));

  }

  handleActiveGet() {
    this.log.debug('Triggered GET Active');

    const currentValue = this.Characteristic.Active.INACTIVE;
    return currentValue;
  }

  handleActiveSet(value) {
    this.log.debug('Triggered SET Active:' + value);

    this.storage.setItemSync(this.name, value);

    child = exec(
      "gatttool -i hci0 -b " + this.speaker + " --char-write-req -a 0x0003 -n " + this.host + (on ? "01" : "02"),
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
