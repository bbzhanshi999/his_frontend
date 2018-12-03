export default {
  setCookie (key, value) {
    if (window.document.cookie && window.document.cookie.indexOf('=') > -1) {
      window.document.cookie = key + '=' + value + ';' + window.document.cookie
    } else {
      window.document.cookie = key + '=' + value
    }
  },
  getCookie (key) {
    let search = key + '='// 查询检索的值
    let returnvalue = ''// 返回值
    if (document.cookie.length > 0) {
      let sd = document.cookie.indexOf(search)
      if (sd !== -1) {
        sd += search.length
        let end = document.cookie.indexOf(';', sd)
        if (end === -1) { end = document.cookie.length }
        // unescape() 函数可对通过 escape() 编码的字符串进行解码。
        returnvalue = unescape(document.cookie.substring(sd, end))
      }
    }
    return returnvalue
  }
}
