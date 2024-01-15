import axios from "axios";

const getClients=(setPageInfo, setDatas)=>{
     axios
    .get("http://192.168.0.100:1337/api/clients/")
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