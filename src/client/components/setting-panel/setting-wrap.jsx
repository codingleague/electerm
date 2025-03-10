/**
 * settings page
 */

import { Component } from 'react'
import { CloseCircleOutlined } from '@ant-design/icons'
import { sidebarWidth } from '../../common/constants'
import './setting-wrap.styl'

export default class SettingWrap extends Component {
  render () {
    const cls = this.props.visible
      ? 'setting-wrap'
      : 'setting-wrap setting-wrap-hide'
    const pops = {
      id: 'setting-wrap',
      className: cls,
      style: {
        left: sidebarWidth + 'px'
      }
    }
    return (
      <div {...pops}>
        <CloseCircleOutlined
          className='close-setting-wrap'
          onClick={this.props.onCancel}
        />
        {this.props.visible ? this.props.children : null}
      </div>
    )
  }
}
