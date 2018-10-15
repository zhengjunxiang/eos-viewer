function getTitle (vm) {
  const { title } = vm.$options
  if (title) {
    return typeof title === 'function' ? title.call(vm) : title
  }
}

const serverTitleMixin = {
  created () {
    const title = getTitle(this)
    if (title) this.$ssrContext.title = `${title} | EOS Viewer`
  }
}

const clientTitleMixin = {
  mounted () {
    const title = getTitle(this)
    if (title) document.title = `${title} | EOS Viewer`
  }
}

export default process.env.VUE_ENV === 'server' ? serverTitleMixin : clientTitleMixin
