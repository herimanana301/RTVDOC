import {
  Paper,
  Text,
  TextInput,
  Button,
  Group,
  SimpleGrid,
  Modal,
} from "@mantine/core";
import { useParams, useLocation } from "react-router-dom";
import ContactIcons from "./ContactIcons.jsx";

import { IconArrowNarrowLeft } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import {
  IconPhone,
  IconMapPin,
  IconAt,
  IconUser,
  IconFileBarcode,
} from "@tabler/icons-react";
import axios from "axios";
import checked from "../../assets/icons/checked.gif";
import wrong from "../../assets/icons/wrong.gif";
import useStyles from "./inputstyles/newclientstyle.js";

export default function NewClient() {
  const { classes } = useStyles(); // utilisation des style déclaré précédemment
  const { id } = useParams(); /*
  permet de recupérer ce qui a été passé comme valeur dans "/client/:id", 
  le nom de variable destructuré doit avoir le même nom 
  que ce qui été mis lors de la déclaration du lien
  */
  const clientDatas = useLocation();
  const currentClient = clientDatas.state
    ? clientDatas.state.clientDatas
    : null;
  const [datas, setDatas] = useState([
    { title: "Raison social", description: "", icon: IconUser }, // les données saisies sont stocké dans description
    { title: "Email", description: "", icon: IconAt },
    { title: "Téléphone", description: "", icon: IconPhone },
    {
      title: "Adresse",
      description: "",
      icon: IconMapPin,
    },
    {
      title: "NIF",
      description: "",
      icon: IconFileBarcode,
    },
    {
      title: "STAT",
      description: "",
      icon: IconFileBarcode,
    },
  ]); // Stockage des données
  const [opened, setOpened] = useState(false); // Permet de gérer le modal qui notifie l'utilisateur si les données ont bien été enregistré ou non
  const [submitError, setSubmitError] = useState(false); // en cas de détection d'erreur lors du POST

  const updateDescription = (index, newDescription) => {
    /*
    la fonction qui permet de mettre à jour les données dans state objet "datas"
    */

    setDatas((prevDatas) => {
      const newDatas = [...prevDatas];
      newDatas[index] = {
        ...newDatas[index],
        description: newDescription,
      };
      return newDatas;
    });
  };
  const submitButton = async () => {
    await axios
      .post("http://192.168.0.101:1337/api/clients", {
        data: {
          raisonsocial: datas[0].description,
          adresse: datas[3].description,
          email: datas[1].description,
          phonenumber: datas[2].description,
          NIF: datas[4].description,
          STAT: datas[5].description,
        },
      })
      .then((response) => {
        console.log(response);
        response.status === 200 && setOpened(true);
        const updatedDatas = datas.map((element) => ({
          ...element,
          description: "",
        })); // remet à vide la clé "description" une fois l'envoie des données effectué
        setDatas(updatedDatas);
      })
      .catch((error) => {
        console.error(error);
        setSubmitError(true);
      });
  }; // requête pour soumettre les données vers STRAPI
  const updateClient = async () => {
    await axios
      .put(`http://192.168.0.101:1337/api/clients/${id}`, {
        data: {
          raisonsocial: datas[0].description,
          adresse: datas[3].description,
          email: datas[1].description,
          phonenumber: datas[2].description,
          NIF: datas[4].description,
          STAT: datas[5].description,
        },
      })
      .then((response) => {
        console.log(response);
        response.status === 200 && setOpened(true);
      })
      .catch((error) => {
        console.error(error);
        setSubmitError(true);
      });
  };
  useEffect(() => {
    if (id) {
      updateDescription(0, currentClient.raisonsocial);
      updateDescription(1, currentClient.email);
      updateDescription(2, currentClient.phonenumber);
      updateDescription(3, currentClient.adresse);
      updateDescription(4, currentClient.NIF);
      updateDescription(5, currentClient.STAT);
    }
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
            {id ? "Modifier le client" : "Nouveau client"}
          </Text>

          <div className={classes.fields}>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <TextInput
                label="Raison social"
                placeholder="Ex: RTV SOAFIA"
                value={datas[0].description}
                onChange={(e) => updateDescription(0, e.target.value)}
                required
              />
              <TextInput
                label="Adresse mail"
                placeholder="herimanana@bluepix.mg"
                value={datas[1].description}
                onChange={(e) => updateDescription(1, e.target.value)}
                required
              />
            </SimpleGrid>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <TextInput
                label="Numéro de téléphone"
                placeholder="Numéro de téléphone"
                value={datas[2].description}
                onChange={(e) => updateDescription(2, e.target.value)}
              />
            </SimpleGrid>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <TextInput
                mt="md"
                label="Adresse"
                placeholder="Adresse de l'entreprise client"
                value={datas[3].description}
                onChange={(e) => updateDescription(3, e.target.value)}
              />
            </SimpleGrid>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <TextInput
                mt="md"
                label="NIF"
                placeholder=""
                value={datas[4].description}
                onChange={(e) => updateDescription(4, e.target.value)}
              />
              <TextInput
                mt="md"
                label="STAT"
                placeholder=""
                value={datas[5].description}
                onChange={(e) => updateDescription(5, e.target.value)}
              />
            </SimpleGrid>
            <Group position="right" mt="md">
              <Button
                type="submit"
                className={classes.control}
                onClick={id ? updateClient : submitButton}
              >
                Enregistrer
              </Button>
            </Group>
          </div>
        </form>
        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          transitionProps={{
            transition: "fade",
            duration: "600",
            timingFunction: "ease",
          }}
        >
          {submitError ? (
            <div className={classes.popup}>
              <img src={wrong} alt="checked" />
              <span>
                {id
                  ? "Erreur lors de la mise à jour"
                  : "Erreur lors de l'enregistrement"}
              </span>
            </div>
          ) : (
            <div className={classes.popup}>
              <img src={checked} alt="checked" />
              <span>
                {id ? "Données clients à jour" : "Client bien enregistré"}
              </span>
            </div>
          )}
        </Modal>
      </div>
    </Paper>
  );
}
