import axios from "axios";
import urls from '../../../services/urls';
import Swal from 'sweetalert2';

const FetchAllConge = (setDatas, setPagination, page) => {
  axios
    .get(`${urls.StrapiUrl}api/conges?pagination[page]=${page}&pagination[pageSize]=30`)
    .then((response) => {
      setDatas(response.data.data);

      setPagination((prevdata) => ({
        ...prevdata,
        pageSize: response.data.meta.pagination.pageCount,
      }));
    })
    .catch((error) => {
      console.error(error);
    });

};

export const FetchAllPersonnel = (setDatas1) => {
  axios
    .get(`${urls.StrapiUrl}api/personnels?pagination[pageSize]=100`)
    .then((response) => {
      setDatas1(response.data.data);
    })
    .catch((error) => {
      console.error(error);
    });

};

export const InsertConge = (Person, motif, jour_prise, datedebut, dateFin,type_conge,close) => {

  try {
       
    axios.put(`${urls.StrapiUrl}api/personnels/${Person.id}`, {
      data: {
        conge: (Person.attributes.conge - jour_prise),
        dateDernierConge : dateFin,
      },

    }).then((response) => {
      if (response.status === 200) {

        axios.post(`${urls.StrapiUrl}api/conges`, {
          data: {
            nom: Person.attributes.nom,
            prenom: Person.attributes.prenom,
            avatar: Person.attributes.avatar,
            type_conge: type_conge,
            motif: motif,
            jour_prise: jour_prise,
            date_debut_conge: datedebut,
            date_fin_conge:dateFin,
          },

        }).then((response) => {
          if (response.status === 200) {

            close();
            
            Swal.fire({
              title: 'Ajout terminé!',
              text: 'Congé ajouté avec succès!',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.isConfirmed) {
               window.location.reload();
              }
            });

          }
        })

      }
    })

  } catch (error) {
    console.error('Erreur lors de la maj des données à Strapi:', error);
    Swal.fire(
      'Erreur',
      'Erreur lors de l\'ajout du congé',
      'error'
  );
  }


};

export default FetchAllConge;
