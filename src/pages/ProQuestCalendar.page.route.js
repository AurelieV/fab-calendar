export default (pageContext) => {
  const { url } = pageContext
  return ['/proquest'].includes(url)
}
