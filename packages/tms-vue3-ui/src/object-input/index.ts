import { Objarr } from './objarr'
import { Render } from '../utils'
import { App, h } from 'vue'

const components = {
  button: {
    add: {
      component: 'button',
      options: { class: { 'tms-object-input__add': true } },
    },
    empty: {
      component: 'button',
      options: { class: { 'tms-object-input__empty': true } },
    },
    remove: {
      component: 'button',
      options: { class: { 'tms-object-input__line-remove': true } },
    },
    moveup: {
      component: 'button',
      options: { class: { 'tms-object-input__line-moveup': true } },
    },
    movedown: {
      component: 'button',
      options: { class: { 'tms-object-input__line-movedown': true } },
    },
  },
  layout: {
    root: {
      component: 'div',
      options: { class: { 'tms-object-input': true } },
    },
    lines: {
      component: 'div',
      options: { class: { 'tms-object-input__lines': true } },
    },
    line: {
      component: 'div',
      options: { class: { 'tms-object-input__line': true } },
    },
    'line-index': {
      component: 'div',
      options: { class: { 'tms-object-input__line-index': true } },
    },
    'line-key': {
      component: 'input',
      options: { class: { 'tms-object-input__line-key': true } },
    },
    'line-slot': {
      component: 'div',
      options: { class: { 'tms-object-input__line-slot': true } },
    },
    'line-buttons': {
      component: 'div',
      options: { class: { 'tms-object-input__line-buttons': true } },
    },
    bottom: {
      component: 'div',
      options: { class: { 'tms-object-input__bottom': true } },
    },
  },
}

export default function install(app: App) {
  app.component('tms-object-input', {
    // setComponent(typeDotName, component, options = {}) {
    //   let [type, name] = typeDotName.split('.')
    //   if (components[type] && components[type][name]) {
    //     let oldComp = components[type][name]
    //     let newComp = { component, options: { ...oldComp.options, ...options } }
    //     components[type][name] = newComp
    //   }
    // },
    props: {
      value: { type: [Array, Object], required: true },
      slotRender: [Function],
    },
    data() {
      const lines =
        typeof this.value === 'object'
          ? new Objarr(this.value, {
              defineProperty: (target: any, property: any, value: any) => {
                this.$set(target, property, value)
              },
              deleteProperty: (target: any, property: any) => {
                this.$delete(target, property)
              },
            })
          : null

      const isInputObject = Array.isArray(this.value) === false

      return {
        lines,
        isInputObject,
      }
    },
    methods: {
      /**
       * 数组中的一行
       */
      createLine(createElement: Function, line: any, index: any, key: any) {
        const buttonNodes = []
        let { remove, moveup, movedown } = components.button
        buttonNodes.push(
          createElement(
            remove.component,
            {
              onClick: (evt: any) => this.remove(evt, line, index, key),
              ...remove.options,
            },
            this.$slots.remove ? this.$slots.remove() : '删除'
          )
        )
        if (index > 0) {
          buttonNodes.push(
            createElement(
              moveup.component,
              {
                onClick: (evt: any) => this.moveUp(evt, line, index),
                ...moveup.options,
              },
              this.$slots.moveup ? this.$slots.moveup() : '上移'
            )
          )
        }
        if (index < this.lines.length - 1) {
          buttonNodes.push(
            createElement(
              movedown.component,
              {
                onClick: (evt: any) => this.moveDown(evt, line, index),
                ...movedown.options,
              },
              this.$slots.movedown ? this.$slots.movedown() : '下移'
            )
          )
        }

        let { layout } = components
        const lineChildNodes = []
        if (this.isInputObject) {
          const lineKeyNode = createElement(layout['line-key'].component, {
            domProps: {
              value: key,
            },
            props: {
              value: key,
            },
            on: {
              input: (event: { target: { value: any } }) => {
                const newValue =
                  event && event.target ? event.target.value : event
                this.lines.rename(key, newValue)
              },
            },
            ...layout['line-key'].options,
          })
          lineChildNodes.push(lineKeyNode)
        } else {
          const lineIndexNode = createElement(
            layout['line-index'].component,
            {
              ...layout['line-index'].options,
            },
            index
          )
          lineChildNodes.push(lineIndexNode)
        }
        const lineSlotNode = createElement(
          layout['line-slot'].component,
          {
            ...layout['line-slot'].options,
          },
          [
            this.$slots.default
              ? this.$slots.default({ line })
              : typeof this.slotRender === 'function'
              ? this.slotRender(createElement, { line })
              : line,
          ]
        )
        lineChildNodes.push(lineSlotNode)
        const lineButtonsNode = createElement(
          layout['line-buttons'].component,
          {
            ...layout['line-buttons'].options,
          },
          buttonNodes
        )
        lineChildNodes.push(lineButtonsNode)

        return Render.layered(
          createElement,
          layout.line.component,
          layout.line.options,
          lineChildNodes
        )
      },
      /**
       * 底部操作
       */
      createBottom(createElement: Function) {
        let { bottom } = components.layout
        let { add, empty } = components.button
        return createElement(
          bottom.component,
          // { ...bottom.component.options },
          [
            createElement(
              add.component,
              {
                onClick: this.emitAdd,
                ...add.options,
              },
              this.$slots.add ? this.$slots.add() : '添加'
            ),
            createElement(
              empty.component,
              {
                onClick: this.empty,
                ...empty.options,
              },
              this.$slots.empty ? this.$slots.empty() : '清空'
            ),
          ]
        )
      },
      emitAdd() {
        this.$emit('add', (newLine: any, key: any) => {
          this.lines.append(newLine, key)
        })
      },
      empty() {
        this.lines.splice(0)
      },
      remove(evt: any, line: any, index: any, key: any) {
        if (this.isInputObject) {
          delete this.lines[key]
        } else {
          this.lines.splice(index, 1)
        }
        this.$forceUpdate()
      },
      moveUp(evt: any, line: any, index: any) {
        if (index === 0) return
        this.lines.move(index, -1)
      },
      moveDown(evt: any, line: any, index: any) {
        if (index === this.lines.length - 1) return
        this.lines.move(index, 1)
      },
    },
    render() {
      if (!this.lines) {
        return h('div', [
          `[ObjectInput-${this._uid}]: 传入的的属性（value）为空`,
        ])
      }
      const nodes = []
      let { layout } = components
      let linesNode = h(
        layout.lines.component,
        { ...layout.lines.options },
        this.lines.map((line: any, index: any) =>
          this.createLine(h, line, index, this.lines.findIndexKey(index))
        )
      )
      nodes.push(linesNode)

      nodes.push(this.createBottom(h))

      return h(layout.root.component, { ...layout.root.options }, nodes)
    },
  })
}
