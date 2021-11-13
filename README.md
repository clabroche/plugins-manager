# Plugins Manager

Simple loader for plugins in node js

## Install
 
 ``` npm i  @iryu54/plugins-manager```

## Usage

``` javascript 
const pluginsManager = require("@iryu54/plugins-manager")

// List all your folders with your js plugins
const pluginsPath = [
  path.resolve(__dirname, 'plugins'), 
  // ....
]

;(async () => {
  await pluginsManager.loadPlugins(pluginsPath)
  // This executes all plugins with brightness responsability with 'increase' as option
  pluginsManager.launch('brightness', 'increase')
})().catch(console.error)
```

``` javascript 
// plugins/brightness.js
module.exports = {
  // Name of the plugin
  name: 'Brightness',
  // This plugin will be executed on brightness command
  command: 'brightness',
  // Describe all requirements to make this plugin working
  requirements: {
    // List of all platforms. See: https://nodejs.org/api/os.html#osplatform
    platforms: [
      'linux'
    ],
    // Check if all this system commands are installed
    commands: [
      'notify-send',
      'xrandr',
      'grep',
    ]
  },
  // If is the right command and all requirments are satisfied, this function is executed
  execute(options) {
    //... 
  },
}
```