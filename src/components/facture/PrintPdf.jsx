import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

function PrintPdf() {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
     content: () => componentRef.current,
     documentTitle: 'Visitor Pass',
     onAfterPrint: () => console.log('Printed PDF successfully!'),
    });
}
    
