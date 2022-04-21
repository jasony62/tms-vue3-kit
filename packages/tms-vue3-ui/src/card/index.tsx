import { App } from 'vue'

export default function (app: App) {
  app.component('tms-card', {
    props: {
      thumb: { type: [String, Boolean] },
      title: { type: String },
      desc: { type: String },
      gap: { type: Number, default: 2 },
      gapMain: { type: Number, default: 2 },
      gapContent: { type: Number, default: 2 },
      backColor: { type: String, default: '#ffffff' },
      descColor: { type: String, default: '#666666' },
      url: { type: String },
      to: { type: Object },
    },
    render() {
      const slots = this.$slots
      const props = this.$props
      const { title, desc, backColor, descColor, to, url } = props
      const thumb = props.thumb === '' ? null : props.thumb
      const that = this
      function onClick() {
        if (url) location.href = url
        else if (to && that.$parent && that.$parent.$router)
          that.$parent.$router.push(to)
      }
      return (
        <div
          class="tms-card"
          onClick={onClick}
          {...{ style: { backgroundColor: backColor } }}
        >
          <tms-flex {...{ direction: 'column', gap: this.gap }}>
            {slots.header ? <header>{slots.header()}</header> : ''}
            <main>
              <tms-flex {...{ elasticItems: [1], gap: this.gapMain }}>
                {thumb === false ? (
                  ''
                ) : (
                  <div class="tms-card__thumb">
                    {slots.thumb ? slots.thumb() : <img src={thumb} />}
                  </div>
                )}
                <div class="tms-card__content">
                  <tms-flex
                    {...{
                      direction: 'column',
                      elasticItems: [1],
                      gap: this.gapContent,
                    }}
                  >
                    <div class="tms-card__title">
                      {slots.title ? slots.title() : title}
                    </div>
                    <div
                      class="tms-card__desc"
                      {...{ style: { color: descColor } }}
                    >
                      {slots.desc ? slots.desc() : desc}
                    </div>
                    {slots.bottom ? (
                      <div class="tms-card__bottom">{slots.bottom?.()}</div>
                    ) : (
                      ''
                    )}
                  </tms-flex>
                </div>
              </tms-flex>
            </main>
            {slots.footer ? <footer>{slots.footer?.()}</footer> : ''}
          </tms-flex>
        </div>
      )
    },
  })
}
