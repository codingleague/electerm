/**
 * upgrade database to v1.27.7
 */

const { userConfigId } = require('../common/constants')
const { dbAction } = require('../lib/nedb')
const { updateDBVersion } = require('./version-upgrade')
const log = require('../common/log')
const { buildProxyString } = require('../lib/build-proxy')
const { buildSshTunnels } = require('../common/build-ssh-tunnel')

async function fixConf () {
  log.info(`Start update global proxy config`)
  const q = {
    _id: userConfigId
  }
  const conf = await dbAction('data', 'findOne', q)
  const proxy = buildProxyString(conf)
  if (proxy) {
    conf.proxy = proxy
  }
  const props = [
    'proxyPort', 'proxyType', 'proxyIp', 'proxyUsername', 'proxyPassword'
  ]
  for (const p of props) {
    delete conf[p]
  }
  await dbAction('data', 'update', q, {
    ...q,
    ...conf
  })
}

async function fixBookmarks () {
  log.info(`Start update bookmark proxy config`)
  const arr = await dbAction('bookmarks', 'find', {})
  const len = arr.length
  let i = 0
  log.info('bookmarks count:', len)
  for (const b of arr) {
    console.log(i + 1, b._id, b.sshTunnel ? 'has sshTunnel' : 'no sshTunnel')
    if (b.sshTunnel) {
      const sshTunnels = buildSshTunnels(b)
      delete b.sshTunnel
      delete b.sshTunnelRemotePort
      delete b.sshTunnelLocalPort
      await dbAction('bookmarks', 'update', {
        _id: b._id
      }, {
        ...b,
        sshTunnels
      })
    }
    i = i + 1
  }
}

async function fixAll () {
  await fixConf()
  await fixBookmarks()
}

module.exports = async () => {
  const versionTo = '1.32.36'
  log.info(`Start: upgrading to v${versionTo}`)
  await fixAll()
  await updateDBVersion(versionTo)
  log.info(`Done: upgrading to v${versionTo}`)
}
