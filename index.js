const { getModule, getModuleByDisplayName } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { Plugin } = require('powercord/entities');
const { sleep } = require('powercord/util');

module.exports = class TwemojiButGood extends Plugin {
  constructor () {
    super();

    this.replace = [
      [ '4c5a77a89716352686f590a6f014770c', 'ccf4c733929efd9762ab02cd65175377' ],
      [ 'fd0dd759c1ed1e0a044fa6882e95fd02', '3071dbc60204c84ca0cf423b8b08a204' ]
    ];
  }

  async startPlugin () {
    const mdl = await getModule([ 'filterUnsupportedEmojis', 'getURL' ]);
    inject('twemojibg-replace', mdl, 'getURL', (args, res) => {
      this.replace.forEach(r => (res = res.replace(r[0], r[1])));
      return res;
    });

    const MessageContent = await getModuleByDisplayName('MessageContent');
    inject('twemojibg-disabled', MessageContent.prototype, 'render', function (args) {
      this.props.message.content = this.props.message.content
        .replace(/^™️/, '\\™️')
        .replace(/([^\\])™️/, '$1\\™️');
      return args;
    }, true);
  }

  pluginWillUnload () {
    uninject('twemojibg-replace');
    uninject('twemojibg-disabled');
  }
};
