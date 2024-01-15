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
  Avatar,

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
      position: "relative",
      borderRadius: theme.radius.lg,
      backgroundSize: "cover",
      backgroundPosition: "center",
      border: `${rem(1)} solid transparent`,
      padding: theme.spacing.xl,
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

  let StrapiUrl = "http://192.168.0.101:1337/";

  const [datas, setDatas] = useState([
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

  /************* Formater et changer la date ****************/


  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  /***************************** ***********************************/

  const [inputValues, setInputValues] = useState({
    nom: "",
    prenom: "",
    departement: "",
    salaire: "",
    dateEmbauche: formatDate(new Date),
  });


  const resetInputs = () => {
    setInputValues({
      nom: "",
      prenom: "",
      departement: "",
      salaire: "",
      dateEmbauche: formatDate(new Date),
      // Réinitialise les valeurs après envoi
    });
    setImageFile(null);
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

  /*************** Insert personal data *********************/

  const submitButton = async () => {
    try {
      if (imageFile) {
        // Si une image est présente, procéder à l'envoi de l'image à Strapi
        const formData = new FormData();
        const renamedFile = new File([imageFile], 'avatar.png', { type: imageFile.type });
        formData.append('files', renamedFile);

        // Envoi de l'image à Strapi
        const imageResponse = await axios.post(StrapiUrl+'api/upload/', formData);
        console.log('Image envoyée avec succès à Strapi:', imageResponse.data);
      // Envoi des données personnelles à Strapi

      const personnelResponse = await axios.post(StrapiUrl+"api/personnels", {
        data: {
          nom: inputValues.nom,
          prenom: inputValues.prenom,
          adresse: datas[2].description,
          contact: datas[0].description,
          email: datas[1].description,
          departement: inputValues.departement,
          poste: datas[3].description,
          salaire: inputValues.salaire,
          date_embauche: inputValues.dateEmbauche,
          avatar: imageResponse.data[0].hash + '.png',
        },
      });

      if (personnelResponse.status === 200) {
        setOpened(true);
        const updatedDatas = datas.map((element) => ({ ...element, description: "" }));
        setDatas(updatedDatas);
        resetInputs();
      }
      } else {
        // Si aucune image n'est présente, effectuer directement la mise à jour des données personnelles
        const personnelResponse = await axios.post(StrapiUrl+"api/personnels", {
          data: {
            nom: inputValues.nom,
            prenom: inputValues.prenom,
            adresse: datas[2].description,
            contact: datas[0].description,
            email: datas[1].description,
            departement: inputValues.departement,
            poste: datas[3].description,
            salaire: inputValues.salaire,
            date_embauche: inputValues.dateEmbauche,
            avatar: 'default_profile1_cc255a96f9.png',
          },
        });

        // Vérification du statut de la mise à jour
        if (personnelResponse.status === 200) {
          setOpened(true);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la maj des données à Strapi:', error);
      setSubmitError(true);
    }

  };

  /*************** Update personal data *********************/

  const updatePersonal = async () => {

    try {
      if (imageFile) {
        // Si une image est présente, procéder à l'envoi de l'image à Strapi
        const formData = new FormData();
        const renamedFile = new File([imageFile], 'avatar.png', { type: imageFile.type });
        formData.append('files', renamedFile);

        // Envoi de l'image à Strapi
        const imageResponse = await axios.post(StrapiUrl+'api/upload/', formData);
        console.log('Image envoyée avec succès à Strapi:', imageResponse.data);

        // Mise à jour des données personnelles avec l'ID spécifié et l'URL de l'image
        const updatePersonnelResponse = await axios.put(StrapiUrl+`api/personnels/${id}`, {
          data: {
            nom: inputValues.nom,
            prenom: inputValues.prenom,
            adresse: datas[2].description,
            contact: datas[0].description,
            email: datas[1].description,
            departement: inputValues.departement,
            poste: datas[3].description,
            salaire: inputValues.salaire,
            date_embauche: inputValues.dateEmbauche,
            avatar: imageResponse.data[0].hash + '.png',
          },
        });

        // Vérification du statut de la mise à jour
        if (updatePersonnelResponse.status === 200) {
          setOpened(true);
        }
      } else {
        // Si aucune image n'est présente, effectuer directement la mise à jour des données personnelles
        const updatePersonnelResponse = await axios.put(StrapiUrl+`api/personnels/${id}`, {
          data: {
            nom: inputValues.nom,
            prenom: inputValues.prenom,
            adresse: datas[2].description,
            contact: datas[0].description,
            email: datas[1].description,
            departement: inputValues.departement,
            poste: datas[3].description,
            salaire: inputValues.salaire,
            date_embauche: inputValues.dateEmbauche,
          },
        });

        // Vérification du statut de la mise à jour
        if (updatePersonnelResponse.status === 200) {
          setOpened(true);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la maj des données à Strapi:', error);
      setSubmitError(true);
    }

  };
  useEffect(() => {
    if (id) {
      inputValues.nom = currentPersonal.nom;
      inputValues.prenom = currentPersonal.prenom;
      inputValues.departement = currentPersonal.departement;
      inputValues.salaire = currentPersonal.salaire;
      // inputValues.dateEmbauche = currentPersonal.dateEmbauche;

      updateDescription(2, currentPersonal.adresse);
      updateDescription(0, currentPersonal.contact);
      updateDescription(1, currentPersonal.email);
      updateDescription(3, currentPersonal.poste);

    }
  }, []);

  const [imageFile, setImageFile] = useState(null);

  const handleDrop = (files) => {
    // Vérifier si des fichiers ont été déposés
    if (files && files.length > 0) {
      const firstFile = files[0];
      // Stocker le fichier dans l'état
      setImageFile(firstFile);
    }
  }

  return (

    <Paper shadow="md" radius="lg">
      <Button component="a" href="/" className={classes.buttonreturn}>
        <IconArrowNarrowLeft size={20} strokeWidth={2} color={"white"} />
        Retour
      </Button>

      <div className={classes.wrapper}>
        <div className={classes.contacts}>
          <Paper style={{ background: 'linear-gradient(135deg, #228be6 36%, #4dabf7 100%)' }} radius="md" withBorder p="lg" bg="var(--mantine-color-body)">

            {imageFile ? (
              <Avatar
                style={{
                  border: '5px solid white',
                }}
                src={URL.createObjectURL(imageFile)}  // Utiliser l'URL objet pour afficher l'image depuis le fichier
                size={190}
                radius={120}
                mx="auto"
              />
            ) : id ? (
              <Avatar
                style={{
                  border: '5px solid white',
                }}
                src={StrapiUrl+'uploads/' + currentPersonal.avatar}  // Utiliser l'URL objet pour afficher l'image depuis le fichier
                size={190}
                radius={120}
                mx="auto"
              />
            ) : (
              <Avatar
                style={{
                  border: '5px solid white',
                }}
                src={StrapiUrl+'uploads/default_profile1_cc255a96f9.png'}  // Utiliser l'URL objet pour afficher l'image depuis le fichier
                size={190}
                radius={120}
                mx="auto"
              />
            )
            }

            <Text style={{ color: 'white' }} ta="center" fz="lg" fw={500} mt="md">
              {inputValues.nom}
            </Text>
            <Text style={{ color: 'white' }} ta="center" c="dark" fw={300}>
              {inputValues.prenom}<br></br>
            </Text>
            <ContactIcons variant="white" display={datas} />
          </Paper>
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
                value={datas[1].description}
                onChange={(e) => updateDescription(1, e.target.value)}
              />
            </SimpleGrid>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <TextInput
                label="Prénom"
                placeholder="Prénom du personnel"
                value={inputValues.prenom}
                onChange={(e) => handleInputChange('prenom', e.target.value)}
                required
              />
              <TextInput
                label="Contact"
                placeholder="ex : 034*****53"
                value={datas[0].description}
                onChange={(e) => updateDescription(0, e.target.value)}
                required
              />
            </SimpleGrid>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <TextInput
                mt="md"
                label="Adresse"
                placeholder="Adresse du personnel"
                value={datas[2].description}
                onChange={(e) => updateDescription(2, e.target.value)}
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
                value={datas[3].description}
                onChange={(e) => updateDescription(3, e.target.value)}
                required
              />
            </SimpleGrid>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <DatePickerInput
                clearable
                valueFormat="DD MMM YYYY"
                value={new Date(inputValues.dateEmbauche)}
                label="Date d'embauche"
                placeholder="January 10, 2026"
                onChange={(date) => handleInputChange('dateEmbauche', formatDate(date))}
              />

              <TextInput
                mt="md"
                label="Salaire"
                placeholder="Salaire en Ariary"
                value={inputValues.salaire}
                onChange={(e) => handleInputChange("salaire", e.target.value)}
              />

              <Dropzone
                onDrop={handleDrop}
                onReject={(files) => console.log('rejected files', files)}
              >
                <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                  <Dropzone.Accept>
                    <IconUpload
                      style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                      stroke={1.5}
                    />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX
                      style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                      stroke={1.5}
                    />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconPhoto
                      style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                      stroke={1.5}
                    />
                  </Dropzone.Idle>

                  <div>
                    <Text size="xl" inline>
                    Glisser l'image ici ou cliquez pour sélectionner le fichier
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                    Joignez une image que vous le souhaitez, le fichier ne doit pas dépasser 5 Mo.
                    </Text>
                  </div>
                </Group>
              </Dropzone>
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
