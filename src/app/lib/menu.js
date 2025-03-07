/**
 * app system menu config
 */
const {
  app,
  Menu,
  shell
} = require('electron')
const openNewInstance = require('./open-new-instance')
const { packInfo } = require('../common/runtime-constants')

function buildMenu () {
  const e = global.et.prefix('menu')
  const c = global.et.prefix('control')
  const s = global.et.prefix('setting')

  const template = [
    {
      label: e('edit'),
      submenu: [
        {
          label: c('newBookmark'),
          accelerator: 'CmdOrCtrl+T',
          click () {
            global.win.webContents.send('new-ssh', null)
          }
        },
        {
          label: c('newWindow'),
          accelerator: 'CmdOrCtrl+N',
          click () {
            openNewInstance()
          }
        },
        {
          role: 'undo',
          label: e('undo')
        },
        {
          role: 'redo',
          label: e('redo')
        },
        {
          type: 'separator'
        },
        {
          role: 'cut',
          label: e('cut')
        },
        {
          role: 'copy',
          label: e('copy'),
          accelerator: 'CmdOrCtrl+C'
        },
        {
          role: 'paste',
          label: e('paste'),
          accelerator: 'CmdOrCtrl+V'
        },
        {
          role: 'pasteandmatchstyle',
          label: e('pasteandmatchstyle')
        },
        {
          role: 'delete',
          label: e('del')
        },
        {
          label: e('selectall'),
          accelerator: 'CmdOrCtrl+A',
          click () {
            global.win.webContents.send('selectall', null)
          }
        },
        {
          type: 'separator'
        },
        {
          label: s('settings'),
          click () {
            global.win.webContents.send('openSettings', null)
          }
        }
      ]
    },
    {
      label: e('view'),
      submenu: [
        {
          role: 'forcereload',
          label: e('forcereload')
        },
        {
          role: 'toggledevtools',
          label: e('toggledevtools')
        },
        {
          type: 'separator'
        },
        {
          click () {
            global.win.webContents.send('zoom-reset', null)
          },
          label: e('resetzoom')
        },
        {
          click () {
            global.win.webContents.send('zoomin', null)
          },
          label: e('zoomin')
        },
        {
          click () {
            global.win.webContents.send('zoomout', null)
          },
          label: e('zoomout')
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen',
          label: e('togglefullscreen')
        }
      ]
    },
    {
      role: 'window',
      label: e('window'),
      submenu: [
        {
          role: 'minimize',
          label: e('minimize')
        },
        {
          label: e('maximize'),
          click () {
            global.win.maximize()
          }
        },
        {
          label: e('restart'),
          click () {
            global.win.close()
            app.relaunch()
          }
        }
      ]
    },
    {
      role: 'help',
      label: e('help'),
      submenu: [
        {
          label: e('about'),
          click () {
            global.win.webContents.send('open-about', null)
          }
        },
        {
          label: e('checkUpdate'),
          click () {
            global.win.webContents.send('checkupdate', null)
          }
        },
        {
          label: e('reportIssue'),
          click () {
            shell
              .openExternal('https://github.com/electerm/electerm/issues/new')
          }
        },
        {
          label: 'github',
          click () {
            shell
              .openExternal('https://github.com/electerm/electerm')
          }
        },
        {
          label: e('homepage'),
          click () {
            shell
              .openExternal(packInfo.homepage)
          }
        },
        {
          label: e('toggledevtools'),
          click () {
            global.win.webContents.openDevTools()
          }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.name,
      submenu: [
        {
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          role: 'hide',
          label: e('hide')
        },
        {
          role: 'hideothers',
          label: e('hideothers')
        },
        {
          role: 'unhide',
          label: e('unhide')
        },
        {
          type: 'separator'
        },
        {
          role: 'quit',
          label: e('quit')
        }
      ]
    })

    template[2].submenu = template[2].submenu
      .filter(d => d.role !== 'togglefullscreen')

    // Edit menu
    template[1].submenu.push({
      type: 'separator'
    }, {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking',
          label: e('startspeaking')
        },
        {
          role: 'stopspeaking',
          label: e('stopspeaking')
        }
      ]
    })

    // Window menu
    template[3].submenu = [
      ...template[3].submenu,
      {
        role: 'zoom',
        label: e('zoom')
      },
      {
        type: 'separator'
      },
      {
        role: 'front',
        label: e('front')
      }
    ]
  }

  const menu = Menu.buildFromTemplate(template)
  return menu
}

module.exports = buildMenu
