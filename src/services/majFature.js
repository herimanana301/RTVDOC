import axios from "axios";
import urls from './urls';
import { useState, useEffect } from "react";

const MajFacture = () => {

    const [Datas, setDatas] = useState([]);
    const [Clients, setClients] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    const differenceEnJours = (date1, date2) => {
        const dateObj1 = new Date(date1);
        const dateObj2 = new Date(date2);
        return Math.round((dateObj2 - dateObj1) / (24 * 60 * 60 * 1000));
    }

    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

    useEffect(() => {

        try {
            axios
                .get(`${urls.StrapiUrl}api/commandes`)
                .then((response) => {
                    if (response.status == 200) {

                        setDatas(response.data.data);

                        axios
                            .get(`${urls.StrapiUrl}api/clients`)
                            .then((response) => {
                                setClients(response.data.data);
                            })
                    }
                })

        } catch (error) {
            console.error('Erreur lors de la recuperation de donnée ', error);
        }

    }, []);

    useEffect(() => {
        Datas.map((Commandes) => {

            let differenceJours = differenceEnJours(Commandes.attributes.endDate, formattedDate);

            let nombreAjours = Math.floor(differenceJours);

            if (nombreAjours > 0 && Commandes.attributes.status == null) {

                try {
       
                    axios.put(`${urls.StrapiUrl}api/commandes/${Commandes.id}`, {
                      data: {
                        status: 'Diffusion terminée',
                      },
                    }).then((response) => {
                    if(response.status == 200){
                        // axios
                        // .get(`${urls.StrapiUrl}api/factures`)
                        // .then((response) => {
                        //     // Check if response data exists and is an array
                        //     if (Array.isArray(response.data) && response.data.length > 0) {
                        //         // Assuming the response data is an array of objects and you want the last item's ID
                        //         const lastItemId = response.data[response.data.length - 1];
                        //         console.log(lastItemId);
                        //     } else {
                        //         console.log("No data or empty array in the response.");
                        //     }
                        // })
                        // .catch((error) => {
                        //     console.error("Error fetching data:", error);
                        // });
                        
                     
                    }

                    })
                
                  } catch (error) {
                    console.error('Erreur lors de la maj des factures ', error);
                  }

            }
            return null;
        });
    }, [Datas]);

};

export default MajFacture;
