module.exports = [
  async _page => {
    // Do something
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      key: 'observe-with-wait'
    }
  }
]
