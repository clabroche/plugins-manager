const fs = require('fs')
const pathfs = require('path')
const commandExists = require('command-exists');
const PromiseB = require('bluebird')
const platform = require('os').platform()
const { notify } = require('./notify')

let plugins = []

function loadPlugins(paths = []) {
  plugins = []
  paths.forEach((path) => {
    if(!fs.existsSync(path)) {
      const msg = `${path} not exists`
      notify({name: 'load plugins'}, msg)
      throw new Error(msg)
    }
    const pluginsPath = pathfs.resolve(__dirname, 'plugins')
    const files = fs.readdirSync(pluginsPath)
    files.forEach(file => {
      const pluginPath = pathfs.resolve(pluginsPath, file)
      if (pathfs.extname(pluginPath) !== '.js') return
      let plugin
      const mockPlugin = { name: pluginPath, }
      try { plugin = require(pluginPath) }
      catch (e) { }
      if (!plugin) notify(mockPlugin, `Cant parse`)
      else if (!plugin?.name) notify(mockPlugin, `Should have name field`)
      else if (!plugin?.execute) notify(plugin, `Should have execute field`)
      else if (!plugin?.command) notify(plugin, `Should have command field`)
      else {
        plugins.push(plugin)
      }
    })
  })
  return plugins
}

async function requirements(plugin) {
  const { platforms, commands } = plugin?.requirements || {}
  if (platforms) {
    if (!platforms.includes(platform)) {
      notify(plugin, `not works in ${platform}`)
      return false
    }
  }
  if (commands?.length) {
    const result = await PromiseB.map(commands, async command => {
      return commandExists(command)
        .then(() => true)
        .catch(() => {
          notify(plugin, `You must install ${command}`)
          return false
        })
    });
    if (result.some(r => !r)) {
      return false
    }
  }
  return true
}

async function launch(command, options) {
  if(!plugins.length) throw Error('No plugins found or plugins are not loaded')
  await PromiseB.map(plugins, async plugin => {
    if (plugin.command === command && await requirements(plugin)) {
      plugin.execute(options)
    }
  })
}

module.exports = {
  getPlugins: () => plugins,
  loadPlugins,
  launch,
  notify
}
