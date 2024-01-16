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
} from "@mantine/core";
import ContactIcons from "../ContactIcons.jsx";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  IconPhone,
  IconAt,
  IconUser,
  IconFileSignal,
  IconCalendarTime,
  IconPlus,
} from "@tabler/icons-react";
import { getClients } from "../../../services/getInformations/getClients.js"; // utilisation de service

//Demande collaboration avec service en retour = Gratuit pour l'annonceur si validation de rabaina
//retracer les moyen de paiement (mobile money, chèque, virement bancaire), avec des numéro de références, les recettes établie

import useStyles from "../inputstyles/neworderstyle.js";




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
  const [service, setService] = useState({
    contentType: "",
    service: "",
    quantity: "",
    priceUnit: 0,
    priceTotal: 0,
  });
  const [serviceList, setServiceList] = useState([]);
  const updateDescription = (index, newDescription) => {
    setDatas((prevDatas) => {
      const newDatas = [...prevDatas]; // Create a shallow copy of the array
      newDatas[index] = {
        ...newDatas[index],
        description: newDescription,
      }; // Update the description
      return newDatas;
    });
  };
  useEffect(() => {
    getClients(setPageInfo, setClients);
    console.log(clients);
  }, []);
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
                data={clients.map((client) => client.attributes.raisonsocial)}
                value={datas[0].description}
                onChange={(e) => updateDescription(0, e)}

              />
            </SimpleGrid>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <TextInput
                label="Numéro de commande"
                placeholder="Saisir numéro de commande"
                value={datas[1].description}
                onChange={(e) => updateDescription(1, e.target.value)}
              />
              <TextInput
                label="Responsable de la commande"
                placeholder=""
                value={datas[2].description}
                onChange={(e) => updateDescription(2, e.target.value)}
              />
            </SimpleGrid>
            <SimpleGrid cols={6} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <Select
                mt="md"
                label="Type de contenue"
                placeholder="Type de contenue"
                data={[
                  { value: "Télévision", label: "Télévision" },
                  { value: "Radio", label: "Radio" },
                ]}
                value={service.contentType && service.contentType}
                onChange={(e) =>
                  setService((prevData) => {
                    const newData = { ...prevData, contentType: e };
                    return newData;
                  })
                }
                required
              />
              <TextInput mt="md" label="Prestation" placeholder="" />
              <NumberInput
                hideControls
                mt="md"
                label="Quantité"
                max={365}
                min={1}
                value={service.quantity && service.quantity}
                onChange={(e) =>
                  setService((prevData) => {
                    const newData = { ...prevData, quantity: e };
                    return newData;
                  })
                }
              />
              <NumberInput
                hideControls
                mt="md"
                label="Prix unitaire"
                onChange={(e) =>
                  setService((prevData) => {
                    const newData = { ...prevData, priceUnit: e };
                    return newData;
                  })
                }
              />
              <NumberInput
                hideControls
                mt="md"
                label="Montant HT"
                value={
                  service.priceUnit && service.quantity
                    ? service.priceUnit * service.quantity
                    : 0
                }
                disabled
              />
              <ActionIcon
                mt="auto"
                size={40}
                variant="default"
                aria-label="ActionIcon with size as a number"
                onClick={() =>
                  setServiceList((prevData) => {
                    const newData = prevData.push(service);
                    return newData;
                  })
                }
              >
                <IconPlus style={{ width: rem(14), height: rem(14) }} />
              </ActionIcon>
            </SimpleGrid>

            <FileInput
              placeholder=".mp4 , .mp3"
              label="Téléverser fichier(s)"
              required
            />
            <Group position="right" mt="md">
              <Button
                type="submit"
                className={(classes.control, classes.voucher)}
              >
                Créer bon de commande
              </Button>
            </Group>
          </div>
        </form>
      </div>
    </Paper>
  );
}
