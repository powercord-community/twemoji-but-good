/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 */

const { getModule } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { Plugin } = require('powercord/entities');

module.exports = class TwemojiButGood extends Plugin {
  constructor () {
    super();

    this.replace = [
      [ '4c5a77a89716352686f590a6f014770c', 'ccf4c733929efd9762ab02cd65175377' ],
      [ 'fd0dd759c1ed1e0a044fa6882e95fd02', '3071dbc60204c84ca0cf423b8b08a204' ],
      [ '464b4c2745e1dda6a86028d09bb8bbec', 'b6f700d4bc253abdb5ad576917b756d8' ]
    ];
    this.hearts = [
      '0483f2b648dcc986d01385062052ae1c', '6d91de9b1030808264973b7cfb2d0a08', '46dc70e2608d986da6de64c6ba5a59da',
      '35221463e22cf68c28b23b6479a43613', 'e37c985edda06b7d5f4559bc838c1bde', 'ec10708f00b5b6767490ffe50dfe2663',
      '0dbfbf14977e0fa1f094d00281332013', '75ef348f4fd073a0ee237584fa350ea6'
    ];
    this.mf = '66ab7f72e745ac8b2ccd0cd920b1d4e8';
  }

  async startPlugin () {
    const mdl = await getModule([ 'filterUnsupportedEmojis', 'getURL' ]);
    inject('twemojibg-replace', mdl, 'getURL', (args, res) => {
      this.replace.forEach(r => (res = res.replace(r[0], r[1])));
      if (res.includes(this.mf) && Math.floor(Math.random() * 666) === 69) {
        return res.replace(this.mf, this.hearts[Math.floor(Math.random() * this.hearts.length)]);
      }
      return res;
    });
  }

  pluginWillUnload () {
    uninject('twemojibg-replace');
  }
};
