/*!
 * create-frame <https://github.com/jonschlinkert/create-frame>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

import define from './define-property.js'
import extend from './extend-shallow.js'

export default function createFrame(data, ...args) {
  if (!data || typeof data !== 'object') {
    throw new TypeError('createFrame expects data to be an object')
  }

  let frame = extend({}, data)
  frame._parent = data

  define(frame, 'extend', function (data) {
    extend(this, data)
  })

  if (args.length) {
    let len = args.length,
      i = -1
    while (++i < len) {
      frame.extend(args[i] || {})
    }
  }
  return frame
}
