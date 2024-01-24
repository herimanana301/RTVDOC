import axios from "axios";
import urls from '../../services/urls';
import Swal from 'sweetalert2';

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

export const InsertFacture = (commande,datePayement,refPayement,montant) => {
  axios.post(`${urls.StrapiUrl}api/commandes`, {
    data: {
      archive: true,
    },
  }).then((response) => {
  if(response.status == 200){
    Swal.fire("Archivée!", "Voir la commande dans archive.", "success");
}})

};



export default FetchAllCommande;
