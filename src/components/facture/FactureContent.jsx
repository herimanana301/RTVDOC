import React, { useEffect, useState } from "react";
import {
    Button,
    Table,
    Text,
}
    from '@mantine/core';
import logo from "../../assets/icons/logo.png";
import { useParams, useLocation } from "react-router-dom";
import { FindOneCommande } from "./hanldeFacture";
import LoadingModal from "./LoadingModal";
import NumberToLetter from "./nombre_en_lettre";


const FactureContent = () => {

    const { id } = useParams();
    const commandeDatas = useLocation();
    const commandePersonal = commandeDatas.state
        ? commandeDatas.state.commandeDatas
        : null;

    const [datasCommande, setDatasCommande] = useState([]);
    const [client, setDatasClient] = useState([]);
    const [prestation, setDatasPrestation] = useState([]);
    let TotalMontant = 0;
    const [pageInfo, setPageInfo] = useState({
        page: 1,
        total: 1,
    });
    const [NowDate, setNowDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);
    const [TVA, setTVA] = useState(false);
    const [remise, setRemise] = useState(false);

    //Calcul 
    const [MontantTotal, setMontantTotal] = useState(0);
    const [TVAValue, setTVAValue] = useState(0);
    const [RemiseValue, setRemiseValue] = useState(0);
    const [totalTTC, setTotalTTC] = useState(0);
    

    const formatDate = (date) => {
  
        const date1 = new Date(date);
    
        const year = date1.getFullYear();
        const month = (date1.getMonth() + 1).toString().padStart(2, "0");
        const day = date1.getDate().toString().padStart(2, "0");
    
        return `${day}-${month}-${year}`;
      };

    const rows = prestation.map((prestation) => (
        <tr key={prestation.id}>
        <td>{prestation.attributes.plateform}</td>
        <td>{prestation.attributes.servicename}</td>
        <td>{prestation.attributes.quantity}</td>
        <td>{prestation.attributes.unityprice}</td>
        <td>{prestation.attributes.quantity*prestation.attributes.unityprice}</td>
      </tr>      
    ))

    /*const TotalMontants = prestation.map((prestation) => (
        TotalMontant = TotalMontant + (prestation.attributes.quantity*prestation.attributes.unityprice)
    ));*/

    // Confirmation de données
    // Confirmation de données
    const handleSubmit = () => {
        let MontantTotalCalc = 0;
    
        prestation.forEach((prestation) => {
            MontantTotalCalc += prestation.attributes.quantity * prestation.attributes.unityprice;
        });
    
        setMontantTotal(MontantTotalCalc);
    
        const TVAValue = TVA ? 0.2 * MontantTotalCalc : 0;
        setTVAValue(TVAValue);
    
        const RemiseValue = remise ? 0.1 * MontantTotalCalc : 0;
        setRemiseValue(RemiseValue);
    
        const TotalTTC = MontantTotalCalc + TVAValue - RemiseValue;
        setTotalTTC(TotalTTC);
    
        setIsLoading(false);
        
        close();
    };
    
    const ValeurEnLettres = NumberToLetter(totalTTC, null, null);

    useEffect(() => {

        FindOneCommande(id, setDatasCommande,setDatasClient,setDatasPrestation);

    }, []);

    return (
        <>
            <Button style={{ marginBottom: "2em" }}>Imprimer</Button>
            <div id="contenu">
                <Text fz="xs">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: "bold" }}>
                            <div style={{ display: "flex" }}>
                                <img src={logo} alt="logo"
                                    style={{ height: 80, margin: 15 }} />
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
                        <div style={{ fontWeight: "bold" , marginLeft: '30px'}}>
                            <span style={{ marginLeft: '-27px' }}><u>Doit</u></span> {client.raisonsocial}<br />
                            {client.NIF}<br />
                            {client.STAT}<br />
                            {client.adresse}<br />
                            Suivant BC n° {datasCommande.reference}<br />
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
                            <tbody>{rows}</tbody>
                        </Table>
                    </div>
                </Text>
                <Text fz={"sm"}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end",}}>
                        <span style={{display: "flex", alignItems: "center"}}><p>TOTAL HT: </p> {MontantTotal}</span>
                        <span style={{display: "flex", alignItems: "center"}}><p>TVA 20%: </p> {TVAValue}</span>
                        <span style={{display: "flex", alignItems: "center"}}><p>Remise 10%: </p> {RemiseValue}</span>
                        <span style={{display: "flex", alignItems: "center"}}><p>TOTAL TTC: </p> {totalTTC}</span>
                    </div>
                    <div style={{textAlign:"center"}}>
                        <p>Arrêté la présente facture à la somme de: <span style={{ textTransform: "uppercase" }}>{ValeurEnLettres} Ariary</span></p>
                        <span>
                            <p> Fianarantsoa, le {formatDate(NowDate)}</p>
                            <p>La Responsable,</p>
                        </span>
                    </div>
                </Text>
            </div>
            
                <LoadingModal
                    onSubmit={handleSubmit}
                    onTVAChange={setTVA} 
                    onRemiseChange={setRemise}
                    close={close}
                /> 
        </>
    );
}

export default FactureContent;
