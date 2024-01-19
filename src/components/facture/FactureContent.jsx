import React from "react";
import {
    Table,
    Text,
}
from '@mantine/core';
import { usePDF } from "react-to-pdf";

const FactureContent = ({ factureData }) => {
    const { toPDF, targetRef } = usePDF({ filename: 'facture.pdf' });
    return (
        <div ref={targetRef}>
            <Text fz="xs">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>
                        <div style={{ display: "flex" }}>
                            <span>ICON</span>
                            <span>
                                <h1>SOAFIA YJOANA</h1>
                                <p>
                                    Immeuble INTERCENTER <br />
                                    Tambohobe - Ampasambazaha <br />
                                    301 - FIANARANTSOA <br />
                                </p>
                            </span>
                        </div>
                        <div>
                            <p>
                                BFV-SG n°0008 01340 05003017343 29 <br />
                                NIF: 4004125945 <br />
                                STAT: 10717 21 2020 0 00975 du 21/09/20 <br />
                                RCS: 2020 B 00022 du 25/09/20 <br />
                                CIF: 0040969/DGI-J du 21/06/2022 <br />
                            </p>
                        </div>
                    </span>
                    <span>
                        <p>
                            TITULAIRE DE COMPTE (BFV) <br />
                            YJOANA SARL RADIO RTV 103 <br />
                            DOMICILIATION <br />
                            01340 FIANARANTSOA <br />
                            REFERENCES BANCAIRES <br />
                            Code Banque 00008 <br />
                            Code Agence 01340 <br />
                            N° de compte 05003017343 <br />
                            Clé 29
                        </p>
                    </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ padding: "15px", border: "1px solid black", textAlign: "center" }}>
                        Facture N° 8395/23
                    </div>
                    <div style={{ fontWeight: "bold" }}><span style={{ textDecoration: "underline", }}>Doit </span>{"Herimanana Rasolonirina"}
                        <br />suivant BC {"N°UMT/010100305/10-23UMATEC"} du {"16/10/23"}
                    </div><br />

                    <Table>
                        <thead>
                            <tr>
                                <th>PERIODE</th>
                                <th>LIBELLES</th>
                                <th>QTE</th>
                                <th>PRIX UNIT</th>
                                <th>MONTANT</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </Table>
                </div>

            </Text>
        </div>

    );
}

export default FactureContent;