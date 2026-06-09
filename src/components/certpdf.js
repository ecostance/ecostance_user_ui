import { useState } from "react";
// import default react-pdf entry
import { Document, Page, pdfjs } from "react-pdf";
// import pdf worker as a url, see `next.config.js` and `pdf-worker.js`
import { verifyAuthenticity } from 'src/apiClient/certificate';
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js';
export default function PDFViewer({ id }) {
    const [numPages, setNumPages] = useState(null);
    const [hasCertificateLoaded, setHasCertificateLoaded] = useState(false);
    const [response, setResponse] = useState(null)

    function onDocumentLoadSuccess({ numPages: nextNumPages }) {
        setHasCertificateLoaded(true)
        setNumPages(nextNumPages);
        verify()
    }
    const verify = async () => {
        if (id) {
            const auth = await verifyAuthenticity(id)
            setResponse(auth)
        }
    }
    return (
        <div style={{ display: "flex", alignItems: 'flex-start' }}>
            <div>
                <Document file={process.env.NEXT_PUBLIC_API_URL + '/certificate/' + id + '.pdf'} onLoadSuccess={onDocumentLoadSuccess}>
                    {Array.from({ length: numPages }, (_, index) => (
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                        />
                    ))}
                </Document>
            </div>
            {hasCertificateLoaded && <div>
                <h3>Authenticity Report</h3>
                {response && <p>Status:{response.status || response.code}</p>}
                {response &&
                    response.status && Object.keys(response.docMetadata)
                        .filter(entry => entry !== 'transactionPayload')
                        .map(entry =>
                            <p key={entry}>{entry}:{response.docMetadata[entry]}</p>
                        )}
            </div>}
        </div>
    );
}
