import axios from "axios";
import urls from "../urls";
const getClients=(setPageInfo, setDatas)=>{
     axios
    .get(`${urls.StrapiUrl}api/clients/`)
    .then((response) => {
      setDatas(response.data.data);
      setPageInfo((prevdata) => ({
        ...prevdata,
        total: response.data.meta.pagination.total,
      }));
    })
    .catch((error) => {
      console.error(error);
    });
}

export {getClients}