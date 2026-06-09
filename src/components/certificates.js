import { useRouter } from "next/router";
import { Col, Container, Row, ListGroup } from 'react-bootstrap';

const Certificates = ({ userCertificates = [], ClassProps = '' }) => {
    const router = useRouter();
    const onClick = (certificate) => {
        let certificateId = certificate.split('/')?.pop() || ''
        certificateId = certificateId?.split('.')[0] || ''
        window.open("/certrack?id=" + certificateId)
    }
    return (
        <Container className={ClassProps}>
            <Row className="justify-content-center">
                <Col md={10} className="text-center">
                    <h2 className='space-mb--20'>
                        Certificates ({userCertificates && userCertificates.length})
                    </h2>
                    <ListGroup>
                        {userCertificates && userCertificates.map((certificate, index) =>
                            <ListGroup.Item key={index}>
                                <a
                                    onClick={() => onClick(certificate)}
                                    target="_blank"
                                    className='space-pt--5 space-pb--5 wrap'
                                >{certificate}
                                </a>

                            </ListGroup.Item>)}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    )
}

export default Certificates