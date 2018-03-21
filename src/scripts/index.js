import 'tachyons'
import '../style/index.css'
import domready from 'domready'
import framework from './framework'
import app from './app'

if (process.env.NODE_ENV !== 'production') {
  require('./util/stats')()
}

domready(framework(app()))
