import React from 'react';

// const CertificateLink = ({ url, certificateNumber }) => (
//   <a href={url} target="__blank">
//     <div style={{ display: 'flex' }}>
//       <span>Certificate: </span>
//       <div>
//         <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
//         </svg>
//       </div>
//       <span>
//         <span>{certificateNumber}</span>
//       </span>
//     </div>
//   </a>
// );

const TimelineItem = ({ direction, date, offsetQuantity, productName, productDescription, imageUrl, certificate }) => (
  <li className="each-order">
    <div className={`timeline-ref direction-${direction}`}>
      <div className="timeline-ref flag-wrapper">
        <span className="timeline-ref hexa"></span>
        {/* <CertificateLink url={certificate.url} certificateNumber={certificate.number} /> */}
      </div>
      <div className="timeline-ref desc direction-l">
        {/* <div className="timeline--time-quantity-holder" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="timeline-item-date">{date}</div>
          <div className="offset-quantity-text">Carbon Offset Quantity: {offsetQuantity} <span>Tons</span></div>
        </div> */}
        <div className="timeline--title--paragraph--holder">
          <div className="timeline--product-name">
            <a>{productName}</a>
          </div>
          <div className="timeline-shorten-paragraph">{productDescription.length > 330 ? productDescription.slice(0, 329) + "..." : productDescription}</div>
        </div>
      </div>
    </div>
    <div className={`timeline--product-image-holder-direction-${direction}-image`}>
      <img style={{ width: '156px' }} alt="abcd" src={imageUrl} />
    </div>
  </li>
);

const Timeline = ({ items }) => (
  <div>
    <ul className="timeline-ref timeline">
      {items.map((item, index) => (
        <TimelineItem
          key={index}
          direction={index % 2 === 0 ? 'r' : 'l'}
          // date={item.date}
          // offsetQuantity={item.offsetQuantity}
          productName={item?.name}
          productDescription={item?.shortDescription}
          imageUrl={item?.image?.[0]}
        // certificate={item.certificate}
        />
      ))}
    </ul>
  </div>
);

export default Timeline;
