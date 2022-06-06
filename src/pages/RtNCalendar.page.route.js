export default (pageContext) => {
  const { url } = pageContext
  return ['/', '/rtn'].includes(url)
}
