import axios from "axios";
import urls from '../../services/urls';
import Swal from 'sweetalert2';

let Isrefresh;
let IsrefreshArchive;

const formatDate = (date) => {

  const date1 = new Date(date);

  const year = date1.getFullYear();
  const month = (date1.getMonth() + 1).toString().padStart(2, "0");
  const day = date1.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const FetchAllCommande = (setDatasCommande, setPageInfo, page, setIsrefresh) => {

  Isrefresh = setIsrefresh;

  axios
    .get(`${urls.StrapiUrl}api/commandes?pagination[page]=${page}&pagination[pageSize]=25&populate=*`)
    .then((response) => {
      const filteredCommandes = response.data.data.filter((Commande) =>
        Commande.attributes.tofacture && !Commande.attributes.archive
      );

      setDatasCommande(filteredCommandes);

      setPageInfo((prevdata) => ({
        ...prevdata,
        pageSize: response.data.meta.pagination.pageCount,
      }));
    })
    .catch((error) => {
      console.error(error);
    });
};
export const FetchAllCommandeArchived = (setDatasCommandeArchived, setPageInfoArchive, page, setIsrefreshArchive) => {

  IsrefreshArchive = setIsrefreshArchive;
  axios
    .get(`${urls.StrapiUrl}api/commandes?pagination[page]=${page}&pagination[pageSize]=50&populate=*`)
    .then((response) => {
      const filteredCommandes = response.data.data.filter((Commande) =>
        Commande.attributes.archive
      );
      setDatasCommandeArchived(filteredCommandes);

      setPageInfoArchive((prevdata) => ({
        ...prevdata,
        pageSize: response.data.meta.pagination.pageCount,
      }));
    })
    .catch((error) => {
      console.error(error);
    });
};



export const FindOneCommande = async (id, setDatasCommande, setDatasClient, setDatasPrestation, setCurrentnumFacture) => {
  await axios
    .get(`${urls.StrapiUrl}api/commandes/${id}?populate=*`)
    .then((response) => {
      setDatasCommande(response.data.data.attributes);
      setDatasClient(response.data.data.attributes.client.data.attributes);
      setDatasPrestation(response.data.data.attributes.prestations.data);
      if(response.data.data.attributes.payement.data){
        setCurrentnumFacture(response.data.data.attributes.payement.data.attributes.refFacture);
      }
    })
    .catch((error) => {
      console.error(error)
    });
};

export const FindCommandeData = async (id, setDatasCommande, setDatasClient, setDatasPrestation, setDatasPayement) => {
  await axios
    .get(`${urls.StrapiUrl}api/commandes/${id}?populate=*`)
    .then((response) => {
      setDatasCommande(response.data.data.attributes);
      setDatasClient(response.data.data.attributes.client.data.attributes);
      setDatasPrestation(response.data.data.attributes.prestations.data);
      setDatasPayement(response.data.data.attributes.payement.data);
    })
    .catch((error) => {
      console.error(error);

      Swal.fire({
        title: "Erreur!",
        text: "Erreur de l'affichage des données facture,réessayer?",
        icon: "error",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload()
        }
      });

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
      Isrefresh(true);
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
      IsrefreshArchive(true);
      Isrefresh(true);
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
        Isrefresh(true);
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
      Isrefresh(true);
    }
  } catch (error) {
    console.error("An error occurred:", error);
    Swal.fire("Erreur!", "Une erreur s'est produite lors de la sauvegarde du paiement.", "error");
  }
};

export const GetnumFacture = async (setLastnumFacture) => {
  try {
    await axios.get(`${urls.StrapiUrl}api/numero-factures?sort=id:desc`)
    .then((response) => {
      setLastnumFacture(parseInt(response.data.data[0].attributes.numeroFacture)+1);
    })
   
  } catch (error) {
    console.error("An error occurred:", error);
   
    Swal.fire({
      title: "Erreur!",
      text: "Erreur de l'affichage des données facture,réessayer?",
      icon: "error",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload()
      }
    });
    
  }


};

export const InsertFacturePrint = (id, refFacture,handlePrint) => {

  try {
    axios.post(`${urls.StrapiUrl}api/payements`, {
      data: {
        commande: id,
        refFacture: refFacture.toString(),
        datePayement: formatDate(new Date()),
        typePayement: 'Non-payé',
        refPayement: '',
        montantTotal: 0,
        avance: 0

      },
    }).then( async ()=>{
      await axios.post(`${urls.StrapiUrl}api/numero-factures`, {
        data: {
          numeroFacture: refFacture,
        },
      }).then(async ()=>{
        await axios.put(`${urls.StrapiUrl}api/commandes/${id}`, {
          data: {
            tofacture: true,
          },
        }).then(()=>{

          Swal.fire({
            title: "Succès!",
            text: "Facture enregistrée avec succès.",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              handlePrint()
            }
          });
          
          
        })
      })
    })
  }
  catch (error) {
    console.error("An error occurred:", error);
    Swal.fire({
      title: "Erreur!",
      text: "Erreur lors de l'enregistrement de la facture,veuillez réessayer.",
      icon: "error",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });
  }

}

export const LastRefFacture = (id, refFacture) => {

  try {
    axios.put(`${urls.StrapiUrl}api/payements/${id}`, {
      data: {
        refFacture: refFacture.toString(),
      },
    })

    const response = axios.post(`${urls.StrapiUrl}api/numero-factures`, {
      data: {
        numeroFacture: refFacture,
      },
    })
    if (response.status === 200) {
      window.location.reload();
    }

  }
  catch (error) {
    console.error("An error occurred:", error);
  }

}


export default FetchAllCommande;
