import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { getCertificate } from 'src/apiClient/certificate'
import { HeaderOne } from 'src/components/Header'
import { returnOneYearForwardDate } from 'src/helpers/formatDateTime'

const certificate = () => {
  const [certDetails, setCertDetails] = useState({})
  const [certLoaded, setCertLoaded] = useState(false)

  useEffect(() => {
    if (!Router.query.certId) {
      return
    }
    const fetchData = async () => {
      const data = await getCertificate(Router.query.certId)
      if (data?.status === 200) {
        setCertDetails(data?.data)
        setCertLoaded(true)
      }
    }
    fetchData().catch((err) => console.log(err))
  }, [])

  const Router = useRouter()

  return (
    <>
      {certLoaded && (
        <>
          <HeaderOne aboutOverlay={false} />
          <div className="certificate--main-holder">
            <div class="certificate--main">
              <div class="certificate-box">
                <div class="certificate--title certificate--content">
                  Sustainability Certificate
                </div>
                <div className="certificate--information-holder">
                  <div class="certificate--section1 certificate--content">
                    <h3>PRESENTED TO</h3>
                    <p>
                      {certDetails?.buyer?.firstName},{' '}
                      {certDetails?.buyer?.city}, {certDetails?.buyer?.state}
                    </p>
                  </div>
                  <div class="certificate-divider"></div>
                  <div className="certificate--information-text-holder">
                    <div class="certificate--section-common certificate--first-common">
                      <div class="certificate-section_child">
                        <p>FOR OFFSETTING</p>
                        <b>
                          {certDetails?.quantity} Metrics tons of CO2e Emissions
                        </b>
                      </div>
                      <div class="certificate-section_child">
                        <p>PROJECT NAME</p>
                        <b>{certDetails?.project?.name}</b>
                      </div>
                    </div>
                    <div class="certificate-divider"></div>
                    <div class="certificate--section-common certificate--second-common">
                      <div class="certificate-section_child">
                        <p>VALID FOR</p>
                        <b>
                          {new Date(
                            certDetails?.buyer?.deliveryDate
                          ).toLocaleDateString()}{' '}
                          to{' '}
                          {returnOneYearForwardDate(
                            certDetails?.buyer?.deliveryDate
                          )}
                        </b>
                      </div>
                      <div class="certificate-section_child">
                        <p>PROJECT OWNER</p>
                        <b>{certDetails?.project?.owner}</b>
                      </div>
                    </div>
                    <div class="certificate-divider"></div>
                    <div class="certificate--section-common certificate--third-common">
                      <div class="certificate-section_child">
                        <p>VERIFICATION STANDARD</p>
                        <b>{certDetails?.project?.standards[0]?.methodology}</b>
                      </div>
                      <div class="certificate-section_child">
                        <p>Project number</p>
                        <b>{certDetails?.originNumber}</b>
                      </div>
                    </div>
                  </div>
                  <div class="certificate-divider"></div>
                  <div class="image-section">
                    <img
                      src={
                        process.env.NEXT_PUBLIC_UI_URL +
                        '/assets/images/netcarbons-signature.png'
                      }
                    />
                    <img
                      src={
                        process.env.NEXT_PUBLIC_UI_URL +
                        '/assets/images/certificate-issuing-org.png'
                      }
                    />
                  </div>
                  <div class="section6 certificate--content"></div>
                </div>
              </div>
              <div className="certificate-box">
                <div class="certificate--title certificate--content">
                  Carbon Chain of Custody
                </div>
                <div class="certificate-box">
                  <div className="chain-of-custody-info-holder">
                    <div className="certificate-deliver--holder">
                      <div className="certificate--number-holder">
                        <p>CERTIFICATE NUMBER</p>
                        <b>{certDetails?.formattedNewOriginNumber}</b>
                      </div>
                      <div className="delivered--date-holder">
                        <p>DELIVERED</p>
                        <b>
                          {' '}
                          {
                            new Date(certDetails?.buyer?.deliveryDate)
                              .toLocaleString()
                              .split(',')[0]
                          }
                        </b>
                      </div>
                    </div>
                    <div class="certificate-divider"></div>
                    <div className="certificate--authenticity-holder">
                      <img
                        className="certificate--check-img"
                        src={process.env.NEXT_PUBLIC_UI_URL + '/check.svg'}
                      />
                      <p>{certDetails?.buyer?.firstName}</p>
                      <b>
                        {certDetails?.project?.name}{' '}
                        {certDetails?.project?.state}
                      </b>
                      <div>
                        <b>
                          {certDetails?.buyer?.firstName},{' '}
                          {certDetails?.buyer?.city},{' '}
                          {certDetails?.buyer?.state},
                          {` ${certDetails?.buyer?.country}`}
                        </b>
                      </div>
                      <p>
                        {
                          new Date(certDetails?.buyer?.deliveryDate)
                            .toLocaleString()
                            .split(',')[0]
                        }
                      </p>
                      <div className="certificate--image-holder">
                        <img
                          src={
                            process.env.NEXT_PUBLIC_UI_URL +
                            '/certificate-cricle.svg'
                          }
                        />
                        <img
                          src={process.env.NEXT_PUBLIC_UI_URL + '/qrcode.svg'}
                        />
                      </div>
                      <b>AUTHENTICITY CERTIFIED BY HASHTRAC.COM</b>
                      <p>{certDetails?.buyer?.transactionId}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="certificate--certificate-info-holder"
              style={{ textAlign: 'center', paddingBottom: '51px' }}
            >
              <p>Authenticity Report</p>
              <p>Status: Authentic</p>
              <p> documentHash:{certDetails?.buyer?.transactionId}</p>
              <p>
                {' '}
                <a
                  href={
                    process.env.NEXT_PUBLIC_UI_URL +
                    '/other/certificate?certId=' +
                    certDetails?.originNumber
                  }
                >
                  documentURL:{process.env.NEXT_PUBLIC_UI_URL}
                  /other/certificate?certId={certDetails?.originNumber}
                </a>
              </p>
              <p>storeLocation:Local</p>
              <p>
                transactionDate:
                {certDetails?.buyer?.deliveryDate}
              </p>
              <p>transactionFrom:EBC</p>
              <p>transactionId:{certDetails?.buyer?.transactionId}</p>
              <p>transactionIssuer:EBC </p>
              <p>transactionTo:customer</p>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default certificate
