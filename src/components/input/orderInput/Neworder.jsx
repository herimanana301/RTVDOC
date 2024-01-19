import {
  Paper,
  Text,
  TextInput,
  Select,
  NumberInput,
  Button,
  Group,
  SimpleGrid,
  FileInput,
  ActionIcon,
  rem,
  Accordion,
} from "@mantine/core";
import ContactIcons from "../ContactIcons.jsx";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  IconPhone,
  IconAt,
  IconUser,
  IconCalendarTime,
  IconPlus,
} from "@tabler/icons-react";
import { getClients } from "../../../services/getInformations/getClients.js"; // utilisation de service
import urls from "../../../services/urls.js";

//Demande collaboration avec service en retour = Gratuit pour l'annonceur si validation du N+1
//retracer les moyen de paiement (mobile money, chèque, virement bancaire), avec des numéro de références, les recettes établie

import useStyles from "../inputstyles/neworderstyle.js";
import accordionStyle from "./newOrder.css?inline";
import { DateInput } from "@mantine/dates";
import axios from "axios";

export default function Neworder() {
  const { classes } = useStyles();
  const [clients, setClients] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    total: 1,
  });
  const [datas, setDatas] = useState([
    { title: "Client", description: "", icon: IconUser },
    { title: "Numéro de commande", description: "", icon: IconAt },
    { title: "Responsable commande", description: "", icon: IconPhone },
  ]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [laterinformation, setLaterinformation] = useState({
    clientId: 0,
    serviceId: [],
  });
  const [service, setService] = useState({
    contentType: "",
    service: "",
    quantity: 0,
    priceUnit: 0,
    priceTotal: 0,
  });
  let [serviceList, setServiceList] = useState([]);
  
  const updateDescription = (index, newDescription) => {
    setDatas((prevDatas) => {
      let newDatas = [...prevDatas]; // Create a shallow copy of the array
      newDatas[index] = {
        ...newDatas[index],
        description: newDescription,
      };
      return newDatas;
    });
  };

  // ...

  const updateFromdropdown = (selectedId) => {
    
    updateDescription(0,clients.find((client) => client.id === selectedId).attributes.raisonsocial);

    
  };



  const handleCreateCommande = async () => {
    const formData = {
      data: {
        client: parseInt(laterinformation.clientId),
        reference: datas[1].description,
        responsableCommande: datas[2].description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    };

    await axios
      .post(`${urls.StrapiUrl}api/commandes`, formData)
      .then((response) => {
        /*         const updatedDatas = datas.map((element) => ({
          ...element,
          description: "",
        }));
        setDatas(updatedDatas); */
      })
      .catch((error) => {
        console.error(error);
        setSubmitError(true);
      });
  };

  const [submitError, setSubmitError] = useState(false);
  useEffect(() => {
    getClients(setPageInfo, setClients);
  }, []);

  const selectData = clients.map((client) => {
    return {
      value: {
        id: client.id,
        clientName: client.attributes.raisonsocial,
      },
      label: client.attributes.raisonsocial,
    };
  });
  return (
    <Paper shadow="md" radius="lg">
      <Button component="a" href="/" className={classes.buttonreturn}>
        <IconArrowNarrowLeft size={20} strokeWidth={2} color={"white"} />
        Retour
      </Button>
      <div className={classes.wrapper}>
        <div className={classes.contacts}>
          <ContactIcons variant="white" display={datas} />
        </div>

        <form
          className={classes.form}
          onSubmit={(event) => event.preventDefault()}
        >
          <Text fz="lg" fw={700} className={classes.title}>
            Nouvelle entrée
          </Text>

          <div className={classes.fields}>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <Select
                label="Client"
                placeholder="Selectionner le client"
                data={clients.map((client) => {
                  return {
                    key: client.id,
                    value: {
                      id: client.id,
                      clientName: client.attributes.raisonsocial,
                    },
                    label: client.attributes.raisonsocial,
                  };
                })}
                onChange={(e) => {
                 updateFromdropdown(e.id)
                }}
                searchable
              />
            </SimpleGrid>

   
          </div>
        </form>
      </div>
    </Paper>
  );
}
