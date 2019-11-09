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
      [ 'fd0dd759c1ed1e0a044fa6882e95fd02', '3071dbc60204c84ca0cf423b8b08a204' ]
    ];
    this.wipe = [
      [ ':tm:', '™️' ],
      [ ':copyright:', '©️' ],
      [ ':registered:', '®️' ]
    ];
  }

  async startPlugin () {
    const mdl = await getModule([ 'filterUnsupportedEmojis', 'getURL' ]);
    inject('twemojibg-replace', mdl, 'getURL', (args, res) => {
      this.replace.forEach(r => (res = res.replace(r[0], r[1])));
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
