import axios from "axios";
import urls from '../../../services/urls';

const FetchAllConge = (setDatas, setPageInfo) => {
  axios
  .get(urls.StrapiUrl+"api/conges")
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
  .get(urls.StrapiUrl+"api/personnels")
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

export default FetchAllConge;
