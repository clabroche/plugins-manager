const notifier = require('node-notifier');

module.exports = {
  notify(plugin, message, custom = {}) {
    const conf = Object.assign(
      {
        name: plugin?.name || 'Plugin inconnu',
        'app-name': plugin?.name || 'Plugin Inconnu',
        title: plugin?.name || 'Plugin inconnu',
        wait: plugin?.notif?.wait || false,
        timeout: plugin?.notif?.timeout || 10,
      },
      { message },
      custom
    )
    notifier.notify(conf);
  }
}