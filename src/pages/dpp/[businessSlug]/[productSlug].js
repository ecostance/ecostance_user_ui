import NotFound from '../../404'

// The product passport is a complete, standalone HTML document (its own <head>,
// <style> and <script>). Injecting it via dangerouslySetInnerHTML does NOT run
// its scripts, so interactive bits (openTab/showImage/changeImage) break with
// "openTab is not defined". Rendering it in an iframe via srcDoc executes those
// scripts natively and isolates its CSS from the app.
const handleIframeLoad = (e) => {
  const iframe = e.currentTarget
  try {
    const win = iframe.contentWindow
    const doc = win.document
    const resize = () => {
      iframe.style.height = doc.documentElement.scrollHeight + 'px'
    }
    resize()
    // Keep height in sync when content height changes (e.g. switching tabs).
    if (win.ResizeObserver) {
      const observer = new win.ResizeObserver(resize)
      observer.observe(doc.documentElement)
    }
    win.addEventListener('resize', resize)
  } catch (err) {
    // Same-origin srcDoc access should not throw, but never break rendering.
    console.error('DPP iframe resize error:', err)
  }
}

const DppPage = ({ htmlContent, notFound, notPublished }) => {
  if (notFound) return <NotFound />

  if (notPublished) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <img src="/assets/images/sustainability-popup.png" alt="" />
        <p style={{ fontWeight: 500 }}>This page has not been published yet</p>
      </div>
    )
  }

  return (
    <iframe
      title="Digital Product Passport"
      srcDoc={htmlContent}
      onLoad={handleIframeLoad}
      style={{ width: '100%', border: 'none', display: 'block', minHeight: '100vh' }}
    />
  )
}

export async function getServerSideProps(context) {
  const { businessSlug, productSlug } = context.params

  try {
    const apiBase = process.env.API_BASE || process.env.NEXT_PUBLIC_API_BASE
    const htmlUrl = `${apiBase}/dpp-pages/${businessSlug}/${productSlug}.html`

    const htmlRes = await fetch(htmlUrl)

    if (htmlRes.ok) {
      const htmlContent = await htmlRes.text()
      return { props: { htmlContent } }
    }

    // HTML file not found — fall back to JSON endpoint to check publish status
    const jsonRes = await fetch(
      `${apiBase}/v1/business-product-page-settings/${businessSlug}/${productSlug}/public`
    )
    const json = await jsonRes.json()

    if (!json.success) {
      return { props: { notPublished: true } }
    }

    return { props: { notFound: true } }
  } catch (err) {
    console.error('DPP page fetch error:', err)
    return { props: { notFound: true } }
  }
}

export default DppPage
