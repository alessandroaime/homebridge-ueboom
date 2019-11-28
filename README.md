# Homebridge UE Boom speaker plugin

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is an accessory plugin for [Homebridge](https://github.com/nfarina/homebridge) allowing to turn on and off a UE Boom speaker and integrating it with [HomeKit](https://www.apple.com/ios/home/).

**Turning off the speaker is not yet possible as it requires `rfcomm` and I've been having some issues with it. As soon as I have time I'll work on it.**

## Installation

First, install [Homebridge](https://github.com/nfarina/homebridge) and [Gatttool](https://www.npmjs.com/package/gatttool) (you also need [Node.js](https://nodejs.org/) installed):

```bash
sudo npm install -g homebridge
sudo npm install -g gatttool
sudo npm install -g homebridge-ueboom
```

## Find out the MAC address

To get the plugin working you have to provide the following parameters:

  * `mac`: MAC address of the speaker

In case you don't know how to retrieve the MAC address of the speaker:

 1. Pair the speaker to your MacBook
 2. Click on Bluetooth icon in the Menu Bar while pressing `⌥ Option`
 3. Select the speaker of which you need the address
 4. Write down the MAC address

## Configuration

Create a [`~/.homebridge/config.json`](https://github.com/nfarina/homebridge/blob/master/config-sample.json) file (change `name` and `mac` as necessary):


```json
{
  "bridge": {
    "name": "Homebridge",
    "username": "E5:B9:0D:64:1E:CB",
    "port": 51826,
    "pin": "031-45-154"
  },
  "description": "This is an example configuration file with homebridge-ueboom plugin.",
  "accessories": [
    {
      "accessory": "UEBoomSpeaker",
      "name": "Bathroom Speaker",
      "mac": "CA:38:93:3B:D8:5D"
    }
  ],
  "platforms": []
}
```