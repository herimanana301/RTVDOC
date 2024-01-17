import axios from "axios";
import urls from '../../../services/urls';

const FetchAllConge = (setDatas, setPageInfo) => {
  axios
    .get(urls.StrapiUrl + "api/conges")
    .then((response) => {
      console.log(response.data.data[0].attributes);
      setDatas(response.data.data);

      setPageInfo((prevdata) => ({
        ...prevdata,
        total: response.data.meta.pagination.total,
      }));
    })
    .catch((error) => {
      console.error(error);
    });

};

export const FetchAllPersonnel = (setDatas1, setPageInfo1) => {
  axios
    .get(urls.StrapiUrl + "api/personnels")
    .then((response) => {
      console.log(response.data.data[0].attributes);
      setDatas1(response.data.data);

      setPageInfo1((prevdata) => ({
        ...prevdata,
        total: response.data.meta.pagination.total,
      }));
    })
    .catch((error) => {
      console.error(error);
    });

};

export const InsertConge = (Person, motif, jour_prise, datedebut, dateFin) => {

  try {

    axios
    .get(urls.StrapiUrl + `api/personnels?idPersonnel=${Person.idPersonnel}`)
    .then((response) => {
      if (response.status === 200){

    const id = response.data.data[0].id;
       
    axios.put(urls.StrapiUrl + `api/personnels/${id}`, {
      data: {
        conge: (Person.conge - jour_prise),
      },

    }).then((response) => {
      if (response.status === 200) {

        axios.post(urls.StrapiUrl + "api/conges", {
          data: {
            idPersonnel: Person.idPersonnel,
            nom: Person.nom,
            prenom: Person.prenom,
            avatar: Person.avatar,
            type_conge: '',
            motif: motif,
            jour_prise: jour_prise,
            date_debut_conge: datedebut,
            date_fin_conge:dateFin,
          },

        }).then((response) => {
          if (response.status === 200) {
            console.log('success');
          }
        })

      }
    })

      }

    })



  } catch (error) {
    console.error('Erreur lors de la maj des données à Strapi:', error);
  }


};

export default FetchAllConge;
