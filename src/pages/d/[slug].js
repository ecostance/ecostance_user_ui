import { useState, useEffect } from 'react'
import router, { useRouter } from 'next/router'
import { BreadcrumbOne } from '../../components/Breadcrumb'
import { getCertificates } from '../../apiClient/user.js'
import Certificates from '../../components/certificates'
import Image from 'next/image'
import { connect } from 'react-redux'
import axios from 'axios'
import NotFound from '../404'
import SustainabilityPage from 'src/components/sustainabilityPage'
import {
  getPublicUserCertPageViaSlug,
  getUserSettings,
} from 'src/apiClient/sustainability'
import Link from 'next/link'
const Cancel = ({ publicUserData, userData }) => {
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

  // return (
  // 	<>
  // 		{URLFound && APIFinished && (
  // 			<>
  // 				<BreadcrumbOne
  // 					pageTitle="Sustainability Page"
  // 					backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.png"
  // 				>
  // 					<ul className="breadcrumb__list">
  // 						<li>Sustainability Page</li>
  // 					</ul>
  // 				</BreadcrumbOne>
  // 				<div
  // 					style={{
  // 						display: 'flex',
  // 						justifyContent: 'center',
  // 						flexDirection: 'column',
  // 						alignItems: 'center',
  // 					}}
  // 				>
  // 					{/* <img src={`${TestAPI}/file`} style={{ maxWidth: '200px' }} /> */}
  // 					{bio.length > 0 && <p>{bio}</p>}
  // 				</div>

  // 				<Certificates
  // 					userCertificates={userCertificates}
  // 					ClassProps="mt-space--100 mb-space--100"
  // 				/>
  // 			</>
  // 		)}
  // 		{!URLFound && APIFinished && <NotFound />}
  // 	</>
  // );

  return (
    <>
      {publicUserData?.success ? (
        <SustainabilityPage
          main={true}
          userSettings={{ ...publicUserData?.data }}
        />
      ) : (
        <div style={styles.emptyPage}>
          {' '}
          <img src="/assets/images/sustainability-popup.png" />{' '}
          <div>
            <p style={styles?.text}>
              {router.query.slug === userData?.slug?.slug
                ? 'You need to publish the page to make it visible'
                : 'The page is not yet published'}
            </p>

            {router.query.slug === userData?.slug?.slug ? (
              <div style={styles?.link}>
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

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
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

export default connect(mapStateToProps)(Cancel)

// export d
//
