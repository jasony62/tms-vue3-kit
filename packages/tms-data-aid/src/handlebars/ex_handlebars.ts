import Handlebars from 'handlebars'
// import handlebarsHelpers from 'handlebars-helpers'

// handlebarsHelpers({ handlebars: Handlebars })

const Helpers = {
  /**
   * Stringify an object using `JSON.stringify`.
   *
   * ```handlebars
   * <!-- object: { foo: 'bar' } -->
   * {{JSONstringify object}}
   * <!-- results in: '{"foo": "bar"}' -->
   * ```
   * @param {Object} `obj` Object to stringify
   * @return {String}
   * @api public
   */
  JSONstringify: (obj: any, indent = 0) => {
    if (typeof indent !== 'number') indent = 0
    return JSON.stringify(obj, null, indent)
  },
}

Object.keys(Helpers).forEach((name) => {
  Handlebars.registerHelper(name, (obj, indent = 0) => {
    return JSON.stringify(obj, null, indent)
  })
})

export { Handlebars }
