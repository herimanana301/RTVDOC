import axios from "axios";
import urls from "../urls";
const getClients=(setPageInfo, setDatas, page)=>{
     axios
    .get(`${urls.StrapiUrl}api/clients?pagination[page]=${page}&pagination[pageSize]=20`)
    .then((response) => {
      setDatas(response.data.data);
      setPageInfo((prevdata) => ({
        ...prevdata,
        total: response.data.meta.pagination.pageCount,
      }));
    })
    .catch((error) => {
      console.error(error);
    });
}

export {getClients}