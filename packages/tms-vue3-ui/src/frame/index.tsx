import { App } from 'vue'

export default function install(app: App) {
  app.component('tms-frame', {
    props: {
      display: {
        type: Object,
        default: () => {
          return { header: true, footer: true, left: true, right: true }
        },
      },
      displaySm: {
        type: Object,
        default: () => {
          return { header: true, footer: true, left: false, right: false }
        },
      },
      backColor: { type: String, default: '#f0f3f6' },
      headerColor: { type: String, default: '#f0f3f6' },
      headerMinHeight: { type: String, default: '32px' },
      leftColor: { type: String, default: '#f0f3f6' },
      leftWidth: { type: String, default: '25%' },
      leftWidthSm: { type: String, default: '100%' },
      centerColor: { type: String, default: '#fff' },
      centerMargin: { type: String, default: '0 8px' },
      centerMarginSm: { type: String, default: '' },
      rightColor: { type: String, default: '#f0f3f6' },
      rightWidth: { type: String, default: '25%' },
      rightWidthSm: { type: String, default: '100%' },
      footerColor: { type: String, default: '#f0f3f6' },
      footerMinHeight: { type: String, default: '32px' },
      mainDirection: { type: String, default: 'row' },
      mainDirectionSm: { type: String, default: 'row' },
    },
    methods: {
      adjust() {
        let props = this.$props
        let elMain = this.$el.querySelector('.tms-frame__main')
        if (elMain) {
          if (this.isSmallScreen) {
            elMain.classList.remove(`tms-frame__main_${props.mainDirection}`)
            elMain.classList.add(`tms-frame__main_${props.mainDirectionSm}`)
          } else {
            elMain.classList.remove(`tms-frame__main_${props.mainDirectionSm}`)
            elMain.classList.add(`tms-frame__main_${props.mainDirection}`)
          }
        }
        let elCenter = this.$el.querySelector('.tms-frame__main__center')
        if (elCenter) {
          if (this.isSmallScreen) {
            elCenter.style.margin = props.centerMarginSm
          } else {
            elCenter.style.margin = props.centerMargin
          }
        }
        let elLeft = this.$el.querySelector('.tms-frame__main__left')
        if (elLeft) {
          elLeft.style.width = this.isSmallScreen
            ? props.leftWidthSm
            : props.leftWidth
        }
        let elRight = this.$el.querySelector('.tms-frame__main__right')
        if (elRight) {
          elRight.style.width = this.isSmallScreen
            ? props.rightWidthSm
            : props.rightWidth
        }
      },
    },
    data: function () {
      return {
        isSmallScreen: false,
      }
    },
    computed: {
      responsiveDisplay: function () {
        return this.isSmallScreen ? this.displaySm : this.display
      },
    },
    mounted() {
      const _this = this
      this.isSmallScreen = window.screen && window.screen.width <= 768
      window.addEventListener('resize', () => {
        this.isSmallScreen = window.screen && window.screen.width <= 768
        // _this.nextTick(() => {
        //   this.adjust()
        // })
      })
      // this.nextTick(() => {
      //   this.adjust()
      // })
    },
    render() {
      let slots = this.$slots
      let props = this.$props
      let headerStyle: { [key: string]: any } = {
        backgroundColor: props.headerColor,
      }
      headerStyle.minHeight = props.headerMinHeight
      let footerStyle: { [key: string]: any } = {
        backgroundColor: props.footerColor,
      }
      footerStyle.minHeight = props.footerMinHeight
      let responsiveDisplay = this.responsiveDisplay

      return (
        <div
          class="tms-frame"
          {...{ style: { backgroundColor: props.backColor } }}
        >
          {responsiveDisplay.header ? (
            <header class="tms-frame__header" {...{ style: headerStyle }}>
              {slots.header?.()}
            </header>
          ) : (
            ''
          )}
          <main class="tms-frame__main">
            {responsiveDisplay.left ? (
              <section
                class="tms-frame__main__left"
                {...{
                  style: {
                    backgroundColor: props.leftColor,
                    width: props.leftWidth,
                  },
                }}
              >
                {slots.left?.()}
              </section>
            ) : (
              ''
            )}
            <section
              class="tms-frame__main__center"
              {...{
                style: {
                  backgroundColor: props.centerColor,
                  margin: props.centerMargin,
                },
              }}
            >
              {slots.center?.()}
            </section>
            {responsiveDisplay.right ? (
              <section
                class="tms-frame__main__right"
                {...{
                  style: {
                    backgroundColor: props.rightColor,
                    width: props.rightWidth,
                  },
                }}
              >
                {slots.right?.()}
              </section>
            ) : (
              ''
            )}
          </main>
          {responsiveDisplay.footer ? (
            <footer class="tms-frame__footer" {...{ style: footerStyle }}>
              {slots.footer?.()}
            </footer>
          ) : (
            ''
          )}
        </div>
      )
    },
  })
}
