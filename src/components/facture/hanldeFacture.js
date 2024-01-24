import axios from "axios";
import urls from '../../services/urls';
import Swal from 'sweetalert2';

const formatDate = (date) => {

  const date1 = new Date(date);

  const year = date1.getFullYear();
  const month = (date1.getMonth() + 1).toString().padStart(2, "0");
  const day = date1.getDate().toString().padStart(2, "0");

  return `${day}/${month}/${year}`;
};

const FetchAllCommande = (setDatasCommande, setPageInfo) => {
  axios
    .get(`${urls.StrapiUrl}api/commandes?populate=*`)
    .then((response) => {
      const filteredCommandes = response.data.data.filter((Commande) => 
        !Commande.attributes.archive && Commande.attributes.status === "Diffusion terminée"
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
        Commande.attributes.archive && Commande.attributes.status === "Diffusion terminée"
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



export const FindOneCommande = (id, setDatasCommande,setDatasClient,setDatasPrestation) => {
  axios
    .get(`${urls.StrapiUrl}api/commandes/${id}?populate=*`)
    .then((response) => {
      // console.log(response.data.data.attributes);
      setDatasCommande(response.data.data.attributes);
      setDatasClient(response.data.data.attributes.client.data.attributes);
      setDatasPrestation(response.data.data.attributes.prestations.data)

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
    if(response.status == 200){
      Swal.fire("Archivée!", "Voir la commande dans archive.", "success");
  }})

};

export const InsertFacture = (id,FormData,refPayement,close) => {

 axios.post(`${urls.StrapiUrl}api/payements`, {
    data: {
      commande:id,
      datePayement: formatDate(FormData.datePayement.toString()),
      refPayement: refPayement,
      montant: FormData.montantTotal.toString(),
      typePayement: FormData.typePayement.toString(),
    },
  }).then((response) => {
  if(response.status == 200){
    Swal.fire("Succès!", "Payement sauvegarder avec succès.", "success");
    close();
}})

};



export default FetchAllCommande;
