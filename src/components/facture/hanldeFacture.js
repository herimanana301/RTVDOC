import axios from "axios";
import urls from '../../services/urls';
import Swal from 'sweetalert2';

const formatDate = (date) => {

  const date1 = new Date(date);

  const year = date1.getFullYear();
  const month = (date1.getMonth() + 1).toString().padStart(2, "0");
  const day = date1.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const FetchAllCommande = (setDatasCommande, setPageInfo) => {
  axios
    .get(`${urls.StrapiUrl}api/commandes?populate=*`)
    .then((response) => {
      const filteredCommandes = response.data.data.filter((Commande) =>
        Commande.attributes.tofacture || (!Commande.attributes.archive && Commande.attributes.status === "Diffusion terminée")
      );

      setDatasCommande(filteredCommandes);

      setPageInfo((prevdata) => ({
        ...prevdata,
        total: response.data.meta.pagination.total,
      }));
    })
    .catch((error) => {
      console.error(error);
    });
};
export const FetchAllCommandeArchived = (setDatasCommandeArchived, setPageInfoArchive) => {
  axios
    .get(`${urls.StrapiUrl}api/commandes?populate=*`)
    .then((response) => {
      const filteredCommandes = response.data.data.filter((Commande) =>
        Commande.attributes.tofacture || (Commande.attributes.archive && Commande.attributes.status === "Diffusion terminée")
      );
      setDatasCommandeArchived(filteredCommandes);

      setPageInfoArchive((prevdata) => ({
        ...prevdata,
        total: response.data.meta.pagination.total,
      }));
    })
    .catch((error) => {
      console.error(error);
    });
};



export const FindOneCommande = (id, setDatasCommande, setDatasClient, setDatasPrestation, setDatasPayement) => {
  axios
    .get(`${urls.StrapiUrl}api/commandes/${id}?populate=*`)
    .then((response) => {
      // console.log(response.data.data.attributes);
      setDatasCommande(response.data.data.attributes);
      setDatasClient(response.data.data.attributes.client.data.attributes);
      setDatasPrestation(response.data.data.attributes.prestations.data);
      response.data.data.attributes.payement.data ? setDatasPayement(response.data.data.attributes.payement.data) : null;
    })
    .catch((error) => {
      console.error(error);
    });

};

export const ArchiverCommande = (id) => {
  axios.put(`${urls.StrapiUrl}api/commandes/${id}`, {
    data: {
      archive: true,
    },
  }).then((response) => {
    if (response.status == 200) {
      Swal.fire("Archivée!", "Voir la commande dans archive.", "success");
    }
  })

};

export const DesarchiverCommande = (id) => {
  axios.put(`${urls.StrapiUrl}api/commandes/${id}`, {
    data: {
      archive: false,
    },
  }).then((response) => {
    if (response.status == 200) {
      Swal.fire("Desarchivée!", "Voir la commande dans Facture.", "success");
    }
  })

};


export const InsertFacture = (id, FormData, refPayement, close) => {

  try {
    axios.post(`${urls.StrapiUrl}api/payements`, {
      data: {
        commande: id,
        refPayement: refPayement,
        typePayement: FormData.typePayement.toString(),
        datePayement: formatDate(FormData.datePayement.toString()),
        montantTotal: FormData.montantTotal.toString(),
        avance: FormData.avanceMontant.toString(),
      },
    }).then((response) => {
      if (response.status == 200) {
        Swal.fire("Succès!", "Payement sauvegarder avec succès.", "success");
        close();
      }
    })
  }
  catch (error) {
    console.error("An error occurred:", error);
    // Handle error, show user-friendly message, etc.
    Swal.fire("Erreur!", "Une erreur s'est produite lors de la sauvegarde du paiement.", "error");
  }

};

export const UpdateFacture = async (id, FormData, refPayement, close) => {

  try {
    const response = await axios.put(`${urls.StrapiUrl}api/payements/${id}`, {
      data: {
        typePayement: FormData.typePayement.toString(),
        refPayement: refPayement,
        datePayement: formatDate(FormData.datePayement.toString()),
        montantTotal: FormData.montantTotal.toString(),
        avance: 0,
      },
    });

    if (response.status === 200) {
      Swal.fire("Succès!", "Paiement sauvegardé avec succès.", "success");
      close();
    }
  } catch (error) {
    console.error("An error occurred:", error);
    // Handle error, show user-friendly message, etc.
    Swal.fire("Erreur!", "Une erreur s'est produite lors de la sauvegarde du paiement.", "error");
  }
};

export const GetnumFacture = async (setnumFacture) => {
  try {
    const response = await axios.get(`${urls.StrapiUrl}api/payements`);
    
    const sortedPayments = response.data.data.sort((a, b) => b.id - a.id); // Sort payments by id in descending order

    const latestPayment = sortedPayments[0]; // Assuming the response is an array
    if (latestPayment) {

      if(latestPayment.attributes.refFacture){
        const numFacture = latestPayment.attributes.refFacture;
        setnumFacture(parseInt(numFacture)+1);
      }else{
        setnumFacture(1);
      }
    
    }

  } catch (error) {
    console.error("An error occurred:", error);
    // Handle error, show user-friendly message, etc.
  }
};

export const InsertFacturePrint = (id,refFacture) => {

  axios
  .get(`${urls.StrapiUrl}api/commandes/${id}?populate=*`)
  .then((response) => {
    if(response.data.data.attributes.payement.data){
     
      console.log();

    }else{
      
      try {
        axios.post(`${urls.StrapiUrl}api/payements`, {
          data: {
            commande: id,
            refFacture: refFacture,
            datePayement:formatDate(new Date()),
            typePayement:'Non-payé',
            refPayement:'',
            montantTotal:0,
            avance:0

          },
        }).then((response) => {
          if (response.status !== 200) {
            console.log('Erreur lors de l\'enregistrement de la numero de reference');
          }
        })
      }
      catch (error) {
        console.error("An error occurred:", error);
      }
      
    }
  })
  .catch((error) => {
    console.error(error);
  });
  

};


export default FetchAllCommande;
