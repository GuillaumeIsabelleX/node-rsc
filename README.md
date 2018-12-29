

___
RSC - Really Simple Content
RSCR - Really Simple Content Routing
===================================

### VISIONS ###

* Really simple content is distributed thru a routing as embedable HTML
```javascript
** ex.  rsc__get("afelia.logo") =>  "/img/ico/afelia.png"
** ex.  rsc__getLogo("afelia","html") =>  <img src=/img/ico/afelia.png class="rsc_logo afelia.logo">
** ex.  rsc__getLogo("main","html") =>  <img src=/img/ico/afelia.png class="rsc_logo afelia.logo">
** ex.  rsc__getLogo ("afelia","html",false) =>  <img src=http://afelia.jgwill.com/img/ico/afelia.png class="rsc_logo afelia.logo">
** ex.  rsc__getLogo ("","html",false) =>  <img src=http://afelia.jgwill.com/img/ico/afelia.png class="rsc_logo afelia.logo">
```


### ACTIONS ###

** A Prototype
* A package Fork compatible as base



### Reality ###

```javascript
//a file ./rsc/default.json 
var rsc = require('node-rsc');


var cnf = rsc.get("Logos");

console.log(cnf.test);
```
```json
{
	"Logos": {
		"test": "myval"
	}
}
```











[![NPM](https://nodei.co/npm/rsc.svg?downloads=true&downloadRank=true)](https://nodei.co/npm/rsc/)&nbsp;&nbsp;
[![Build Status](https://secure.travis-ci.org/lorenwest/node-rsc.svg?branch=master)](https://travis-ci.org/lorenwest/node-rsc)&nbsp;&nbsp;
[release notes](https://github.com/lorenwest/node-rsc/blob/master/History.md)

Introduction
------------

Node-rsc organizes hierarchical rscurations for your app deployments.

It lets you define a set of default parameters,
and extend them for different deployment environments (development, qa,
staging, production, etc.).

Rscurations are stored in [rscuration files](https://github.com/lorenwest/node-rsc/wiki/Rscuration-Files) within your application, and can be overridden and extended by [environment variables](https://github.com/lorenwest/node-rsc/wiki/Environment-Variables),
 [command line parameters](https://github.com/lorenwest/node-rsc/wiki/Command-Line-Overrides), or [external sources](https://github.com/lorenwest/node-rsc/wiki/Rscuring-from-an-External-Source).

This gives your application a consistent rscuration interface shared among a
[growing list of npm modules](https://www.npmjs.org/browse/depended/rsc) also using node-rsc.

Project Guidelines
------------------

* *Simple* - Get started fast
* *Powerful* - For multi-node enterprise deployment
* *Flexible* - Supporting multiple rsc file formats
* *Lightweight* - Small file and memory footprint
* *Predictable* - Well tested foundation for module and app developers

Quick Start
---------------
The following examples are in JSON format, but rscurations can be in other [file formats](https://github.com/lorenwest/node-rsc/wiki/Rscuration-Files#file-formats).

**Install in your app directory, and edit the default rsc file.**

```shell
$ npm install rsc
$ mkdir rsc
$ vi rsc/default.json
```
```js
{
  // Customer module rscs
  "Customer": {
    "dbRsc": {
      "host": "localhost",
      "port": 5984,
      "dbName": "customers"
    },
    "credit": {
      "initialLimit": 100,
      // Set low for development
      "initialDays": 1
    }
  }
}
```

**Edit rsc overrides for production deployment:**

```shell
 $ vi rsc/production.json
```

```json
{
  "Customer": {
    "dbRsc": {
      "host": "prod-db-server"
    },
    "credit": {
      "initialDays": 30
    }
  }
}
```

**Use rscs in your code:**

```js
var rsc = require('rsc');
//...
var dbRsc = rsc.get('Customer.dbRsc');
db.connect(dbRsc, ...);

if (rsc.has('optionalFeature.detail')) {
  var detail = rsc.get('optionalFeature.detail');
  //...
}
```

`rsc.get()` will throw an exception for undefined keys to help catch typos and missing values.
Use `rsc.has()` to test if a rscuration value is defined.

**Start your app server:**

```shell
$ export NODE_ENV=production
$ node my-app.js
```

Running in this rscuration, the `port` and `dbName` elements of `dbRsc`
will come from the `default.json` file, and the `host` element will
come from the `production.json` override file.

Articles
--------

* [Rscuration Files](https://github.com/lorenwest/node-rsc/wiki/Rscuration-Files)
  * [Special features for JavaScript rscuration files](https://github.com/lorenwest/node-rsc/wiki/Special-features-for-JavaScript-rscuration-files)
* [Common Usage](https://github.com/lorenwest/node-rsc/wiki/Common-Usage)
* [Environment Variables](https://github.com/lorenwest/node-rsc/wiki/Environment-Variables)
* [Reserved Words](https://github.com/lorenwest/node-rsc/wiki/Reserved-Words)
* [Command Line Overrides](https://github.com/lorenwest/node-rsc/wiki/Command-Line-Overrides)
* [Multiple Node Instances](https://github.com/lorenwest/node-rsc/wiki/Multiple-Node-Instances)
* [Sub-Module Rscuration](https://github.com/lorenwest/node-rsc/wiki/Sub-Module-Rscuration)
* [Rscuring from a DB / External Source](https://github.com/lorenwest/node-rsc/wiki/Rscuring-from-an-External-Source)
* [Securing Production Rsc Files](https://github.com/lorenwest/node-rsc/wiki/Securing-Production-Rsc-Files)
* [External Rscuration Management Tools](https://github.com/lorenwest/node-rsc/wiki/External-Rscuration-Management-Tools)
* [Examining Rscuration Sources](https://github.com/lorenwest/node-rsc/wiki/Examining-Rscuration-Sources)
* [Using Rsc Utilities](https://github.com/lorenwest/node-rsc/wiki/Using-Rsc-Utilities)
* [Upgrading from Rsc 0.x](https://github.com/lorenwest/node-rsc/wiki/Upgrading-From-Rsc-0.x)
* [Webpack usage](https://github.com/lorenwest/node-rsc/wiki/Webpack-Usage)

Further Information
---------------------
If you still don't see what you are looking for, here more resources to check: 

 * The [wiki may have more pages](https://github.com/lorenwest/node-rsc/wiki) which are not directly linked from here.
 * Review [questions tagged with node-rsc](https://stackexchange.com/filters/207096/node-rsc) on StackExchange. These are monitored by `node-rsc` contributors.
 * [Search the issue tracker](https://github.com/lorenwest/node-rsc/issues). Hundreds of issues have already been discussed and resolved there.

Contributors
------------
<table id="contributors"><tr><td><img src=https://avatars2.githubusercontent.com/u/373538?v=4><a href="https://github.com/lorenwest">lorenwest</a></td>
<td><img src=https://avatars1.githubusercontent.com/u/25829?v=4><a href="https://github.com/markstos">markstos</a></td>
<td><img src=https://avatars3.githubusercontent.com/u/447151?v=4><a href="https://github.com/elliotttf">elliotttf</a></td>
<td><img src=https://avatars1.githubusercontent.com/u/8839447?v=4><a href="https://github.com/jfelege">jfelege</a></td>
<td><img src=https://avatars0.githubusercontent.com/u/66902?v=4><a href="https://github.com/leachiM2k">leachiM2k</a></td>
<td><img src=https://avatars1.githubusercontent.com/u/791137?v=4><a href="https://github.com/josx">josx</a></td>
</tr><tr><td><img src=https://avatars2.githubusercontent.com/u/133277?v=4><a href="https://github.com/enyo">enyo</a></td>
<td><img src=https://avatars3.githubusercontent.com/u/1077378?v=4><a href="https://github.com/arthanzel">arthanzel</a></td>
<td><img src=https://avatars2.githubusercontent.com/u/1656140?v=4><a href="https://github.com/eheikes">eheikes</a></td>
<td><img src=https://avatars0.githubusercontent.com/u/355800?v=4><a href="https://github.com/diversario">diversario</a></td>
<td><img src=https://avatars3.githubusercontent.com/u/138707?v=4><a href="https://github.com/th507">th507</a></td>
<td><img src=https://avatars2.githubusercontent.com/u/506460?v=4><a href="https://github.com/Osterjour">Osterjour</a></td>
</tr><tr><td><img src=https://avatars0.githubusercontent.com/u/842998?v=4><a href="https://github.com/nsabovic">nsabovic</a></td>
<td><img src=https://avatars0.githubusercontent.com/u/5138570?v=4><a href="https://github.com/ScionOfBytes">ScionOfBytes</a></td>
<td><img src=https://avatars2.githubusercontent.com/u/2529835?v=4><a href="https://github.com/simon-scherzinger">simon-scherzinger</a></td>
<td><img src=https://avatars1.githubusercontent.com/u/175627?v=4><a href="https://github.com/axelhzf">axelhzf</a></td>
<td><img src=https://avatars3.githubusercontent.com/u/7782055?v=4><a href="https://github.com/benkroeger">benkroeger</a></td>
<td><img src=https://avatars3.githubusercontent.com/u/1872824?v=4><a href="https://github.com/fgheorghe">fgheorghe</a></td>
</tr><tr><td><img src=https://avatars3.githubusercontent.com/u/1443067?v=4><a href="https://github.com/IvanVergiliev">IvanVergiliev</a></td>
<td><img src=https://avatars0.githubusercontent.com/u/1736957?v=4><a href="https://github.com/jpwilliams">jpwilliams</a></td>
<td><img src=https://avatars2.githubusercontent.com/u/1246875?v=4><a href="https://github.com/jaylynch">jaylynch</a></td>
<td><img src=https://avatars1.githubusercontent.com/u/145742?v=4><a href="https://github.com/jberrisch">jberrisch</a></td>
<td><img src=https://avatars1.githubusercontent.com/u/9355665?v=4><a href="https://github.com/kgoerlitz">kgoerlitz</a></td>
<td><img src=https://avatars0.githubusercontent.com/u/8525267?v=4><a href="https://github.com/bertho-zero">bertho-zero</a></td>
</tr><tr><td><img src=https://avatars3.githubusercontent.com/u/8650543?v=4><a href="https://github.com/leonardovillela">leonardovillela</a></td>
<td><img src=https://avatars3.githubusercontent.com/u/1918551?v=4><a href="https://github.com/nitzan-shaked">nitzan-shaked</a></td>
<td><img src=https://avatars3.githubusercontent.com/u/3058150?v=4><a href="https://github.com/robertrossmann">robertrossmann</a></td>
<td><img src=https://avatars2.githubusercontent.com/u/498929?v=4><a href="https://github.com/roncli">roncli</a></td>
<td><img src=https://avatars2.githubusercontent.com/u/1355559?v=4><a href="https://github.com/superoven">superoven</a></td>
<td><img src=https://avatars2.githubusercontent.com/u/54934?v=4><a href="https://github.com/wmertens">wmertens</a></td>
</tr></table>

License
-------

May be freely distributed under the [MIT license](https://raw.githubusercontent.com/lorenwest/node-rsc/master/LICENSE).

Copyright (c) 2010-2018 Loren West 
[and other contributors](https://github.com/lorenwest/node-rsc/graphs/contributors)

