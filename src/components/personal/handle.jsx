import {
  Paper,
  Text,
  TextInput,
  Button,
  Group,
  SimpleGrid,
  createStyles,
  rem,
  Modal,
} from "@mantine/core";
import { useParams, useLocation } from "react-router-dom";
import { DatePickerInput } from "@mantine/dates";
import { Dropzone } from "@mantine/dropzone";
import ContactIcons from "../input/ContactIcons";

import { IconArrowNarrowLeft } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import {
  IconPhone,
  IconMapPin,
  IconAt,
  IconUser,
  IconFileBarcode,
  IconUpload,
  IconPhoto,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import checked from "../../assets/icons/checked.gif";
import wrong from "../../assets/icons/wrong.gif";

//Partie style, négligable à comprendre
const useStyles = createStyles((theme) => {
  const BREAKPOINT = theme.fn.smallerThan("sm");

  return {
    buttonreturn: {
      marginBottom: rem(20),
    },
    wrapper: {
      display: "flex",
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
      borderRadius: theme.radius.lg,
      padding: rem(4),
      border: `${rem(1)} solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[2]
      }`,

      [BREAKPOINT]: {
        flexDirection: "column",
      },
    },

    form: {
      boxSizing: "border-box",
      flex: 1,
      padding: theme.spacing.xl,
      paddingLeft: `calc(${theme.spacing.xl} * 2)`,
      borderLeft: 0,

      [BREAKPOINT]: {
        padding: theme.spacing.md,
        paddingLeft: theme.spacing.md,
      },
    },

    fields: {
      marginTop: rem(-12),
    },

    fieldInput: {
      flex: 1,

      "& + &": {
        marginLeft: theme.spacing.md,

        [BREAKPOINT]: {
          marginLeft: 0,
          marginTop: theme.spacing.md,
        },
      },
    },

    fieldsGroup: {
      display: "flex",

      [BREAKPOINT]: {
        flexDirection: "column",
      },
    },

    contacts: {
      boxSizing: "border-box",
      position: "relative",
      borderRadius: theme.radius.lg,
      backgroundSize: "cover",
      backgroundPosition: "center",
      border: `${rem(1)} solid transparent`,
      //padding: theme.spacing.xl,
      flex: `0 0 ${rem(280)}`,

      [BREAKPOINT]: {
        marginBottom: theme.spacing.sm,
        paddingLeft: theme.spacing.md,
      },
    },

    title: {
      marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,

      [BREAKPOINT]: {
        marginBottom: theme.spacing.xl,
      },
    },

    control: {
      [BREAKPOINT]: {
        flex: 1,
      },
    },
    voucher: {
      backgroundColor: "orange",
    },
    popup: {
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
      display: "flex",
      justifyContent: "space-evenly",
      flexDirection: "row",
      alignItems: "center",
      paddingBottom: rem(50),
      fontSize: rem(20),
    },
  };
});
// fin partie style
export default function NewPersonal() {
  const { classes } = useStyles(); // utilisation des style déclaré précédemment
  const { id } = useParams(); /*
  permet de recupérer ce qui a été passé comme valeur dans "/personal/:id", 
  le nom de variable destructuré doit avoir le même nom 
  que ce qui été mis lors de la déclaration du lien
  */
  const personalDatas = useLocation();
  const currentPersonal = personalDatas.state
    ? personalDatas.state.personalDatas
    : null;

  const [datas, setDatas] = useState([
    { title: "Identité", description: "", icon: IconUser }, // les données saisies sont stocké dans description
    { title: "Contact", description: "", icon: IconPhone },
    { title: "Email", description: "", icon: IconAt },
    {
      title: "Adresse",
      description: "",
      icon: IconMapPin,
    },
    {
      title: "Poste",
      description: "",
      icon: IconFileBarcode,
    },
  ]); // Stockage des données

  const [inputValues, setInputValues] = useState({
    nom: "",
    departement: "",
    salaire: "",
    dateEmbauche: new Date(),
  });

  const resetInputs = () => {
    setInputValues({
      nom: "",
      departement: "",
      salaire: "",
      // Réinitialise les valeurs après envoi
    });
  };

  const handleInputChange = (fieldName, value) => {
    setInputValues({ ...inputValues, [fieldName]: value });
  };

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
      .post("http://192.168.0.101:1337/api/personnels", {
        data: {
          nom: inputValues.nom,
          prenom: datas[0].description,
          adresse: datas[3].description,
          contact: datas[1].description,
          email: datas[2].description,
          departement: inputValues.departement,
          poste: datas[4].description,
          salaire: inputValues.salaire,
          // dateEmbauche: inputValues.dateEmbauche,
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
        resetInputs();
      })
      .catch((error) => {
        console.error(error);
        setSubmitError(true);
      });
  }; // requête pour soumettre les données vers STRAPI
  const updatePersonal = async () => {
    await axios
      .put(`http://192.168.0.101:1337/api/personnels/${id}`, {
        data: {
          nom: inputValues.nom,
          prenom: datas[0].description,
          adresse: datas[3].description,
          contact: datas[1].description,
          email: datas[2].description,
          departement: inputValues.departement,
          poste: datas[4].description,
          salaire: inputValues.salaire,
          // dateEmbauche: inputValues.dateEmbauche,
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
      inputValues.nom = currentPersonal.nom;
      inputValues.departement = currentPersonal.departement;
      inputValues.salaire = currentPersonal.salaire;
      // inputValues.dateEmbauche = currentPersonal.dateEmbauche;

      updateDescription(0, currentPersonal.prenom);
      updateDescription(3, currentPersonal.adresse);
      updateDescription(1, currentPersonal.contact);
      updateDescription(2, currentPersonal.email);
      updateDescription(4, currentPersonal.poste);
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
            {id ? "Modifier le personnel" : "Nouveau personnel"}
          </Text>

          <div className={classes.fields}>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <TextInput
                label="Nom"
                placeholder="Nom du personnel"
                value={inputValues.nom}
                onChange={(e) => handleInputChange("nom", e.target.value)}
                required
              />
              <TextInput
                label="Adresse mail"
                placeholder="herimanana@bluepix.mg"
                value={datas[2].description}
                onChange={(e) => updateDescription(2, e.target.value)}
              />
            </SimpleGrid>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <TextInput
                label="Prénom"
                placeholder="Prénom du personnel"
                value={datas[0].description}
                onChange={(e) => updateDescription(0, e.target.value)}
                required
              />
              <TextInput
                label="Contact"
                placeholder="ex : 034*****53"
                value={datas[1].description}
                onChange={(e) => updateDescription(1, e.target.value)}
                required
              />
            </SimpleGrid>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <TextInput
                mt="md"
                label="Adresse"
                placeholder="Adresse du personnel"
                value={datas[3].description}
                onChange={(e) => updateDescription(3, e.target.value)}
                required
              />
            </SimpleGrid>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <TextInput
                mt="md"
                label="Département"
                placeholder=""
                value={inputValues.departement}
                onChange={(e) =>
                  handleInputChange("departement", e.target.value)
                }
              />
              <TextInput
                mt="md"
                label="Poste"
                placeholder=""
                value={datas[4].description}
                onChange={(e) => updateDescription(4, e.target.value)}
                required
              />
            </SimpleGrid>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <DatePickerInput
                clearable
                valueFormat="DD MMM YYYY"
                defaultValue={inputValues.dateEmbauche}
                label="Date d'embauche"
                placeholder="January 10, 2026"
                onChange={(date) => handleInputChange("dateEmbauche", date)}
              />
              <TextInput
                label="Salaire"
                placeholder="Salaire du personnel"
                value={inputValues.salaire}
                onChange={(e) => handleInputChange("salaire", e.target.value)}
              />
            </SimpleGrid>
            <Group position="right" mt="md">
              <Button
                type="submit"
                className={classes.control}
                onClick={id ? updatePersonal : submitButton}
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
                {id ? "Données personnel à jour" : "Personnel bien enregistré"}
              </span>
            </div>
          )}
        </Modal>
      </div>
    </Paper>
  );
}
