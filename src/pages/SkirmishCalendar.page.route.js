export default (pageContext) => {
  const { url } = pageContext
  return ['/', '/skirmish'].includes(url)
}
