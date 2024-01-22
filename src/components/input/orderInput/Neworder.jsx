import {
  Paper,
  Text,
  TextInput,
  Select,
  NativeSelect,
  NumberInput,
  Button,
  Group,
  SimpleGrid,
  FileInput,
  ActionIcon,
  rem,
  Accordion,
  Modal,
} from "@mantine/core";
import ContactIcons from "../ContactIcons.jsx";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { IconHash, IconTie, IconUser, IconPlus } from "@tabler/icons-react";
import { getClients } from "../../../services/getInformations/getClients.js"; // utilisation de service
import urls from "../../../services/urls.js";
import checked from "../../../assets/icons/checked.gif";
import wrong from "../../../assets/icons/wrong.gif";

//Demande collaboration avec service en retour = Gratuit pour l'annonceur si validation du N+1
//retracer les moyen de paiement (mobile money, chèque, virement bancaire), avec des numéro de références, les recettes établie

import useStyles from "../inputstyles/neworderstyle.js";
import accordionStyle from "./newOrder.css?inline";
import { DateInput } from "@mantine/dates";
import axios from "axios";
import { inputConfirmation } from "../../../services/alertConfirmation.js";

export default function Neworder() {
  const { classes } = useStyles();
  const [clients, setClients] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    total: 1,
  });
  const [datas, setDatas] = useState([
    { title: "Client", description: "", icon: IconUser },
    { title: "Numéro de commande", description: "", icon: IconHash },
    { title: "Responsable commande", description: "", icon: IconTie },
  ]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [laterinformation, setLaterinformation] = useState({
    clientId: 0,
    serviceId: [],
    evidenceFile: [],
    mediaFiles: [],
  });
  const [service, setService] = useState({
    contentType: "",
    service: "",
    quantity: 0,
    priceUnit: 0,
    priceTotal: 0,
  });
  const [serviceList, setServiceList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
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
    updateDescription(
      0,
      clients.find((client) => client.id === selectedId).attributes.raisonsocial
    );

    setLaterinformation((prevData) => {
      return { ...prevData, clientId: selectedId };
    });
  };

  const handleCreateCommande = async () => {
    try {
      setLoading(true);
      if (serviceList.length < 1) {
        throw new Error("Vous n'avez pas fournis de prestation");
      } else if (
        laterinformation.mediaFiles.length < 1 &&
        laterinformation.evidenceFile.length < 1
      ) {
        throw new Error(
          "Vous n'avez pas fournis les fichier et bien la preuve de bon de commande"
        );
      } else if (
        laterinformation.mediaFiles.length < 1 ||
        laterinformation.evidenceFile.length < 1
      ) {
        throw new Error(
          "Vous n'avez pas fournis les fichier ou bien la preuve de bon de commande"
        );
      }
      let evidenceSubmit = new FormData();
      evidenceSubmit.append("files", laterinformation.evidenceFile[0]);
      const evidenceUploadResponse = await axios.post(
        `${urls.StrapiUrl}api/upload`,
        evidenceSubmit
      );

      const evidenceFileId = evidenceUploadResponse.data[0].url;

      const formData = {
        data: {
          client: parseInt(laterinformation.clientId),
          reference: datas[1].description,
          responsableCommande: datas[2].description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          evidence: evidenceFileId,
        },
      };

      const commandResponse = await axios.post(
        `${urls.StrapiUrl}api/commandes`,
        formData
      );
      console.log(commandResponse);

      if (commandResponse.status === 200) {
        const promises = serviceList.map(async (service) => {
          return axios
            .post(`${urls.StrapiUrl}api/prestations`, {
              data: {
                plateform:
                  service.contentType === "Télévision" ? "TV" : "RADIO",
                servicename: service.service,
                quantity: service.quantity,
                unityprice: service.priceUnit,
                totalservice: service.priceTotal,
                commande: commandResponse.data.data.id,
              },
            })
            .then((response) => response.data);
        });

        await Promise.all(promises);

        let fileFormData = new FormData();
        for (let i = 0; i <= laterinformation.mediaFiles.length; i++) {
          fileFormData.append("files", laterinformation.mediaFiles[i]);
        }
        await axios
          .post(`${urls.StrapiUrl}api/upload`, fileFormData)
          .then((mediaUploadResponse) => {
            if (mediaUploadResponse.status === 200) {
              return Promise.all(
                mediaUploadResponse.data.map(async (mediaDetails) => {
                  try {
                    const publiciteResponse = await axios.post(
                      `${urls.StrapiUrl}api/publicites`,
                      {
                        data: {
                          lien: mediaDetails.url,
                          intitule: mediaDetails.name,
                          commande: commandResponse.data.data.id,
                        },
                      }
                    );
                    setLoading(false);
                    setSubmitSuccess(true);
                    return publiciteResponse.data;
                  } catch (error) {
                    console.error("Error uploading media:", error);
                    throw error;
                  }
                })
              );
            }
          });
      }
    } catch (error) {
      setSubmitError(true);
      setErrorMessage(error.toString());
      setLoading(false);
    }
  };

  useEffect(() => {
    getClients(setPageInfo, setClients);
  }, []);
  useEffect(() => {
    setService((prevData) => {
      return { ...prevData, priceTotal: service.priceUnit * service.quantity };
    });
  }, [service.priceUnit, service.quantity]);
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
                data={
                  clients &&
                  clients.map((client) => ({
                    value: client.id,
                    label: client.attributes.raisonsocial,
                  }))
                }
                onChange={(e) => {
                  updateFromdropdown(e);
                }}
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

              <DateInput
                label="Date de début diffusion"
                placeholder="Selectionner date de début"
                value={startDate}
                onChange={(e) => setStartDate(e)}
              />

              <DateInput
                label="Date fin diffusion"
                placeholder="Selectionner date de fin"
                value={endDate}
                onChange={(e) => setEndDate(e)}
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
              <TextInput
                mt="md"
                label="Prestation"
                placeholder=""
                value={service.service}
                onChange={(e) =>
                  setService((prevData) => {
                    const newData = { ...prevData, service: e.target.value };
                    return newData;
                  })
                }
              />
              <NumberInput
                hideControls
                mt="md"
                label="Quantité"
                max={365}
                min={1}
                value={service.quantity}
                onChange={(e) =>
                  setService((prevData) => {
                    const newData = { ...prevData, quantity: parseInt(e) };
                    return newData;
                  })
                }
              />
              <NumberInput
                hideControls
                mt="md"
                label="Prix unitaire"
                value={service.priceUnit}
                onChange={(e) =>
                  setService((prevData) => {
                    const newData = { ...prevData, priceUnit: parseFloat(e) };
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
                onClick={() => {
                  setServiceList((prevData) => {
                    return [...prevData, service];
                  });
                  setService({
                    contentType: "",
                    service: "",
                    quantity: 0,
                    priceUnit: 0,
                    priceTotal: 0,
                  });
                }}
              >
                <IconPlus style={{ width: rem(14), height: rem(14) }} />
              </ActionIcon>
            </SimpleGrid>
            <SimpleGrid cols={1} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <Accordion
                className={accordionStyle.chevron}
                chevron={<IconPlus style={{ width: "20px", height: "20px" }} />}
              >
                {serviceList.length > 0 &&
                  serviceList.map((serviceSingle) => (
                    <Accordion.Item value={serviceSingle.contentType}>
                      <Accordion.Control
                        icon={
                          serviceSingle.contentType === "Télévision"
                            ? "📺"
                            : "📻"
                        }
                      >
                        {serviceSingle.contentType}
                      </Accordion.Control>
                      <Accordion.Panel>
                        <p>Prestation : {serviceSingle.service} </p>
                        <p> Quantité : {serviceSingle.quantity} </p>
                        <p> Prix unitaire : {serviceSingle.priceUnit} </p>
                        <p> Total : {serviceSingle.priceTotal} </p>
                      </Accordion.Panel>
                    </Accordion.Item>
                  ))}
              </Accordion>
            </SimpleGrid>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <FileInput
                placeholder=".mp4 , .mp3, .ogg, .mpg, .avi, .ts, .mkv"
                accept="audio/*, video/*"
                label="Téléverser fichier(s) Audio ou/et Video"
                value={laterinformation.mediaFiles}
                onChange={(e) => {
                  setLaterinformation((prevData) => {
                    return {
                      ...prevData,
                      mediaFiles: e,
                    };
                  });
                  console.log(laterinformation.mediaFiles);
                }}
                required
                multiple
                clearable
              />
              <FileInput
                accept="image/png,image/jpeg,application/pdf "
                placeholder=".pdf , .jpeg ,.png"
                label="Téléverser Preuve de commande"
                value={laterinformation.evidenceFile}
                onChange={(e) =>
                  setLaterinformation((prevData) => {
                    return { ...prevData, evidenceFile: e };
                  })
                }
                clearable
                required
                multiple
              />
            </SimpleGrid>

            <Group position="right" mt="md">
              <Button
                type="submit"
                className={(classes.control, classes.voucher)}
                onClick={() => inputConfirmation(handleCreateCommande)}
                loading={isLoading}
              >
                Créer bon de commande
              </Button>
            </Group>
          </div>
        </form>
        <Modal
          opened={submitError || submitSuccess}
          onClose={() => {
            if (submitError) {
              setSubmitError(false);
            }
            if (submitSuccess) {
              setSubmitSuccess(false);
              const updatedDatas = datas.map((element) => ({
                ...element,
                description: "",
              }));
              setDatas(updatedDatas);
              setStartDate("");
              setEndDate("");
              setServiceList([]);
              setLaterinformation({
                clientId: 0,
                serviceId: [],
                evidenceFile: [],
                mediaFiles: [],
              });
            }
          }}
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
                {errorMessage
                  ? errorMessage
                  : "Erreur lors de l'enregistrement"}
              </span>
            </div>
          ) : (
            <div className={classes.popup}>
              <img src={checked} alt="checked" />
              <span>Commande bien enregistré</span>
            </div>
          )}
        </Modal>
      </div>
    </Paper>
  );
}
