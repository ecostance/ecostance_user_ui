import router, { useRouter } from 'next/router'
import { connect } from 'react-redux'
import SustainabilityPage from 'src/components/sustainabilityPage'
import { getPublicUserCertPageViaSlug } from 'src/apiClient/sustainability'
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
  link: {
    textAlign: 'center',
    width: '100%',
  },
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

const SustainabilitySlugPage = ({ publicUserData, userData }) => {
  return (
    <>
      {publicUserData?.success ? (
        <SustainabilityPage
          main={true}
          userSettings={{ ...publicUserData?.data }}
        />
      ) : (
        <div style={styles.emptyPage}>
          <img src="/assets/images/sustainability-popup.png" />
          <div>
            <p style={styles.text}>
              {router.query.slug === userData?.slug?.slug
                ? 'You need to publish the page to make it visible'
                : 'The page is not yet published'}
            </p>
            {router.query.slug === userData?.slug?.slug ? (
              <div style={styles.link}>
                <Link
                  href={
                    process.env.NEXT_PUBLIC_UI_URL +
                    '/other/my-account?sustainability=true'
                  }
                >
                  Go to sustainability page
                </Link>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      )}
    </>
  )
}

export async function getServerSideProps(context) {
  const slug = context.params
  const res = await getPublicUserCertPageViaSlug(slug?.slug)

  if (res?.data?.success == false) {
    return { props: { publicUserData: res?.data } }
  }

  const uniqueProjectNames = []
  const uniqueProjectNameCheck = {}

  res?.data?.data?.userCertificates?.map((each) => {
    each.certificateNumber = each?.originNumber
    each.quantity = each?.order?.products[0]?.quantity || 1
    if (!uniqueProjectNameCheck[each?.product?.name]) {
      uniqueProjectNames.push(each?.product?.name)
    } else {
      uniqueProjectNameCheck[each?.product?.name] = true
    }
  })

  res?.data?.data
    ? (res.data.data.projectNames = uniqueProjectNames.filter(onlyUnique))
    : ''

  return { props: { publicUserData: res?.data } }
}

const mapStateToProps = (state) => {
  return { userData: state.userData }
}

export default connect(mapStateToProps)(SustainabilitySlugPage)
