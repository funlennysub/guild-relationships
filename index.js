const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getModule, React } = require('powercord/webpack');
const { open } = require('powercord/modal');
const { resolve } = require('path');

const Modal = require('./components/SRsModal.jsx');

module.exports = class RelationShips extends Plugin {
  async startPlugin () {
    this._injectContextMenu();
    this.loadCSS(resolve(__dirname, 'style.css'));
  }

  async _injectContextMenu () {
    const menu = await getModule([ 'MenuItem' ]);
    const mdl = await getModule(m => m.default && m.default.displayName === 'GuildContextMenu');
    inject('guild-relationships', mdl, 'default', ([ { target, guild: { id: guildId } } ], res) => {
      if (target.tagName.toLowerCase() === 'a') {
        res.props.children.splice(4, 0,
          React.createElement(menu.MenuItem, {
            id: 'guild-relationships',
            label: 'Guild Relationships',
            action: () => open(() => React.createElement(Modal, { guildId }))
          })
        );
      }
      return res;
    });
    mdl.default.displayName = 'GuildContextMenu';
  }

  pluginWillUnload () {
    uninject('guild-relationships');
  }
};
