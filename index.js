/**
 * Twemoji But Good
 * Copyright (C) 2019 Bowser65
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const { getModule, getModuleByDisplayName } = require('powercord/webpack');
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
    this.wipe = [
      [ ':tm:', '™️' ],
      [ ':copyright:', '©️' ],
      [ ':registered:', '®️' ]
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

    const MessageContent = await getModuleByDisplayName('MessageContent');
    inject('twemojibg-disabled', MessageContent.prototype, 'render', (args, res) => {
      const fn = res.props.children;
      res.props.children = (data) => {
        const res = fn(data);
        const ch = res.props.children[1].props.children;
        if (!Array.isArray(ch)) {
          return res;
        }
        res.props.children[1].props.children = ch.map(c => {
          const fn = (o) => typeof o === 'object' && o.props && this.wipe.map(w => w[0]).includes(o.props.text)
            ? this.wipe.find(w => w[0] === o.props.text)[1]
            : o;

          if (Array.isArray(c)) {
            return c.map(fn);
          } else if (typeof c === 'object') {
            return fn(c);
          }
          return c;
        });
        return res;
      };

      return res;
    });
  }

  pluginWillUnload () {
    uninject('twemojibg-replace');
    uninject('twemojibg-disabled');
  }
};
