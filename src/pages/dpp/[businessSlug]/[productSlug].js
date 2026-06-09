import NotFound from '../../404'

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
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
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
