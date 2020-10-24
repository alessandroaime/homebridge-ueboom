<p align="center">
  <a href="https://github.com/alessandroaime/homebridge-ueboom"><img src="README/logo.png" width="500px"></a>
</p>

<span align="center">

# Homebridge UE Boom (Speaker Plugin)

<a href="https://opensource.org/licenses/MIT"><img title="license" src="https://img.shields.io/badge/License-MIT-yellow.svg" ></a>
<a href="https://github.com/homebridge/homebridge/wiki/Verified-Plugins"><img title="homebridge verified" src="https://badgen.net/badge/homebridge/verified/purple" ></a>
<a href="https://www.npmjs.com/package/homebridge-ueboom"><img title="npm version" src="https://badgen.net/npm/v/homebridge-ueboom" ></a>
<a href="https://www.npmjs.com/package/homebridge-ueboom"><img title="npm downloads" src="https://badgen.net/npm/dt/homebridge-ueboom" ></a>
<a href="https://www.paypal.me/alessandroaime"><img title="paypal" src="https://badgen.net/badge/Donate/PayPal/91BE09" ></a>

</span>

This is an accessory plugin for [Homebridge](https://github.com/nfarina/homebridge) allowing to turn on and off a UE Boom speaker and integrating it with [HomeKit](https://www.apple.com/ios/home/).

## Installation

### Homebridge

First, install [Homebridge](https://github.com/nfarina/homebridge) and `gatttool` via [Bluez](http://www.bluez.org) (you also need [Node.js](https://nodejs.org/) installed):

```bash
sudo npm install -g homebridge
sudo apt-get install bluez
```

Then install this plugin:

```bash
sudo npm install -g homebridge-ueboom
```

### Homebridge Docker

In case you're using [Homebridge Docker](https://github.com/oznu/docker-homebridge), add the following line to your container startup script:

```bash
apk add --no-cache bluez-deprecated
```

Then install this plugin:

```bash
sudo npm install -g homebridge-ueboom
```

## Find out the MAC address

To get the plugin working you have to provide the following parameters:

  * `speaker`: MAC address of the speaker
  * `host`: MAC address of the music source device (iPhone, ...)

In case you don't know how to retrieve the MAC address of the speaker:

 1. Pair the speaker to your MacBook
 2. Click on Bluetooth icon in the Menu Bar while pressing `⌥ Option`
 3. Select the speaker of which you need the address
 4. Write down the MAC address

To retrieve the MAC address of the host, it strictly depends on the device you're using. If you're playing music from an iPhone/iPad then you can find it in `Settings > General > About > Bluetooth`.

## Configuration

Create a [`~/.homebridge/config.json`](https://github.com/nfarina/homebridge/blob/master/config-sample.json) file (change `name`, `speaker` and `host` as necessary):


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
      "speaker": "C0:28:8D:45:28:55",
      "host": "4098ADA356C4"
    }
  ],
  "platforms": []
}
```

**Breaking change: in case you're transitioning from v0.0.1 or v0.0.2, update your config file with the newly requested variables!**

## How does it work

Since more than one person asked me how this works and that the speaker doesn't connect to the Pi after being turned on, I thought I could spend a couple of words about.

This is the command that does the whole work, everything else is just boilerplate code for the homebridge plugin:

```bash
gatttool -i hci0 -b $SPEAKER_ADDRESS --char-write-req -a 0x0003 -n ${HOST_ADDRESS}01
```

**The `gatttool` command turns the speaker on but doesn’t associate the speaker with the Raspberry Pi. The speaker connects to the `host` device (in my case my iPhone).**

I don't know the exact specifications so this is pure speculation: the speaker itself has the usual Bluetooth 4.0 module that allows to stream music, in addition to that there's also a BLE (Bluetooth Low Energy) module that for its own nature is always on and allows to turn the speaker on and off remotely (within range). The only reason why I'm not sure this is the real reason is that the two modules would probably have two separate MAC addresses, and from what I've observed there's only one single address available.

## How I did it

I knew that the speaker could be turned on remotely (within range) using the proprietary [Ultimate Ears app](https://apps.apple.com/us/app/boom-megaboom/id632344648), and it was obvious that the bluetooth command was sent by the application itself.

I first installed Apple's [Bluetooth logging profile](https://developer.apple.com/services-account/download?path=/iOS/iOS_Logs/iOSBluetoothLogging.mobileconfig) on my iPhone, then connected it to the Mac via USB and used [PacketLogger](https://download.developer.apple.com/Developer_Tools/Additional_Tools_for_Xcode_11/Additional_Tools_for_Xcode_11.dmg) to trace the packages sent from the phone (specifically `ATT Send` type). By opening the UE app and tapping on the remote power button in it I was able to *sniff* the conversation between the phone and the speaker as shown in this screenshot.

![packetLoggerScreenshot](README/packetLoggerScreenshot.png)

From here I retrieved the MAC address of the speaker (as described above) and used `gatttool` to perform a write request, and *BOOM* I can turn on the speaker from my command line.

## Contributors

Special thanks go to:

- [Newton Barbosa](https://github.com/newtonlb), for noticing that `Value` is the host MAC address without semicolons followed by `01`.
- [Donavan Becker](https://github.com/donavanbecker), for adding the easy config for [`onzu/homebridge-config-ui-x`](https://github.com/oznu/homebridge-config-ui-x).
- [Martin Kuhl](https://github.com/MartinKuhl), for figuring out how to turn the speaker off by replacing the final `01` with `02`.
