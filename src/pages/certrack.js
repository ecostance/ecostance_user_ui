import dynamic from "next/dynamic";
import { useRouter } from 'next/router'
const PDFViewer = dynamic(() => import("../components/certpdf"), {
    ssr: false
});

export default function PDF() {
    const Router = useRouter()
    const { query: { id } } = Router
    return <PDFViewer id={id} />;
}
