import { connect } from 'react-redux'
import BusinessSustainabilityPage from 'src/components/businessSustainabilityPage'
import { getPublicBusinessPageBySlug } from 'src/apiClient/businessSustainability'
import Link from 'next/link'

const styles = {
  emptyPage: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '60px',
  },
  text: {
    fontWeight: 500,
  },
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

const BusinessSustainabilitySlugPage = ({ publicUserData }) => {
  return (
    <>
      {publicUserData?.success ? (
        <BusinessSustainabilityPage
          main={true}
          userSettings={{ ...publicUserData?.data }}
        />
      ) : (
        <div style={styles.emptyPage}>
          <img src="/assets/images/sustainability-popup.png" />
          <p style={styles.text}>The page is not yet published</p>
        </div>
      )}
    </>
  )
}

export async function getServerSideProps(context) {
  const { slug } = context.params

  try {
    const res = await getPublicBusinessPageBySlug(slug)

    if (res?.data?.success === false) {
      return { props: { publicUserData: res?.data } }
    }

    const uniqueProjectNames = []
    const uniqueProjectNameCheck = {}

    res?.data?.data?.userCertificates?.forEach((each) => {
      each.certificateNumber = each?.originNumber
      // Match this cert's line item — products[0] makes every cert show the first item's qty
      const matched = each?.order?.products?.find(
        (product) =>
          (product?.certificate?.originNumber || product?.certificateNumber) ===
          each?.originNumber
      )
      each.quantity = matched?.quantity || 1
      if (!uniqueProjectNameCheck[each?.product?.name]) {
        uniqueProjectNames.push(each?.product?.name)
        uniqueProjectNameCheck[each?.product?.name] = true
      }
    })

    if (res?.data?.data) {
      res.data.data.projectNames = uniqueProjectNames.filter(onlyUnique)
    }

    return { props: { publicUserData: res?.data } }
  } catch (err) {
    return { props: { publicUserData: { success: false } } }
  }
}

const mapStateToProps = (state) => {
  return { userData: state.userData }
}

export default connect(mapStateToProps)(BusinessSustainabilitySlugPage)
