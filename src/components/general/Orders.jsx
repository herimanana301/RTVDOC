import React, { useEffect, useState, useMemo } from "react";
import {
  Avatar,
  NumberInput,
  Badge,
  Table,
  Group,
  Text,
  ActionIcon,
  Anchor,
  ScrollArea,
  Modal,
  useMantineTheme,
  Button,
  TextInput,
  rem,
  Notification,
  Tooltip
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconEye,
  IconX,
  IconCheck,
  IconFileInvoice,
} from "@tabler/icons-react";
import urls from "../../services/urls";
import axios from "axios";
import "./order.css";
import { confirmationPutModal } from "../../services/alertConfirmation";
export default function Orders({
  searchQuery,
  filterStatus,
  paginationPage,
  setPagination,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [commandeData, setCommandeData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modifiedData, setModifiedData] = useState({
    id: 0,
    endDate: new Date(),
    reference: "",
  });
  const [authentication, setAuthentication] = useState(false);
  const [authenticationModal, setAuthenticationModal] = useState(true);
  const [authentificationcredential, setAuthenticationcredential] = useState({
    username: "",
    password: "",
  });
  const [inputAuthentication, setInputAuthentication] = useState({
    username: "",
    password: "",
  });
  const fetchCommandeData = async () => {
    try {
      const response = await axios.get(
        `${urls.StrapiUrl}api/commandes?pagination[page]=${paginationPage}&pagination[pageSize]=25&populate=*`
      );
      return {
        data: response.data.data,
        paginationSize: response.data.meta.pagination.pageCount,
      };
    } catch (error) {
      console.error("Error fetching data from Strapi:", error);
      return [];
    }
  };
  const [error, setError] = useState(false);
  const [successSubmit, setSuccessSubmit] = useState(false);
  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
  const updateOrderData = () => {
    axios
      .put(`${urls.StrapiUrl}api/commandes/${modifiedData.id}`, {
        data: {
          endDate: modifiedData.endDate,
          reference: modifiedData.reference,
        },
      })
      .then((response) => {
        response && setSuccessSubmit(true);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
      });
  };

  const updatePrestationData = (prestationId, updatedQuantity) => {
    const updatedPrestation = selectedItem.attributes.prestations.data.find(
      (prestation) => prestation.id === prestationId
    );

    updatedPrestation.attributes.quantity = updatedQuantity;
    updatedPrestation.attributes.totalservice =
      updatedQuantity * updatedPrestation.attributes.unityprice;

    axios
      .put(`${urls.StrapiUrl}api/prestations/${prestationId}`, {
        data: {
          quantity: updatedQuantity,
          totalservice: updatedPrestation.attributes.totalservice,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCommandeData();
      setCommandeData(data.data);
      setPagination((prevData) => {
        return {
          ...prevData,
          pageSize: data.paginationSize,
        };
      });
    };
    fetchData();
  }, [paginationPage]);
  useEffect(() => {
    axios.get(`${urls.StrapiUrl}api/users`).then((response) => {
      setAuthenticationcredential({
        username: response.data[0].username,
        password: response.data[0].passwordfororder,
      });
    });
  }, []);
  const handleModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };
  const toIncoice = (id) => {
    window.location.href=`/facture/${id}`
  };
  const diffusionStatus = (dateDebut, dateFin) => {
    const currentDate = new Date();
    const startDate = new Date(dateDebut);
    const endDate = new Date(dateFin);
    if (startDate <= currentDate && endDate >= currentDate) {
      return "En cours de diffusion";
    } else if (startDate > currentDate) {
      return "En attente de diffusion";
    } else {
      return "Diffusion terminée";
    }
  };

  const theme = useMantineTheme();

  const rows = useMemo(() => {
    return commandeData
      .filter(
        (item) =>
          (item.attributes.client.data &&
            item.attributes.client.data.attributes.raisonsocial &&
            item.attributes.client.data.attributes.raisonsocial
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          item.attributes.responsableCommande
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.attributes.reference
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
      .filter(
        (item) =>
          filterStatus === "" ||
          diffusionStatus(item.attributes.startDate, item.attributes.endDate)
            .toLowerCase()
            .includes(filterStatus.toLowerCase())
      )
      .map((item, index) => (
        <React.Fragment key={index}>
          <tr>
            <td>
              <Text size="sm"> {item.id} </Text>
            </td>
            <td>
              <Group spacing="sm">
                <Text fz="sm" fw={500}>
                  {item.attributes.client.data &&
                  item.attributes.client.data.attributes.raisonsocial ?
                    (item.attributes.client.data.attributes.raisonsocial.includes(
                      " "
                    ) ?
                      item.attributes.client.data.attributes.raisonsocial
                        .split(" ")
                        .map((word, index) => (
                          <React.Fragment key={index}>
                            {word}
                            <br />
                          </React.Fragment>
                        ))
                      : item.attributes.client.data.attributes.raisonsocial)
                    : '-'}
                </Text>
              </Group>
            </td>
            <td>
              <Text size="sm"> {item.attributes.responsableCommande} </Text>
            </td>
            <td>
              <Text size="sm"> {item.attributes.reference} </Text>
            </td>
            <td>
              <Text size="sm">
                {new Date(item.attributes.startDate).toLocaleDateString()}
              </Text>
            </td>
            <td>
              <Text size="sm">
                {new Date(item.attributes.endDate).toLocaleDateString()}
              </Text>
            </td>
            <td>
              <Text size="sm">
                {" "}
                {item.attributes.prestations.data.reduce((sum, element) => {
                  return sum + element.attributes.totalservice;
                }, 0)}{" "}
                Ar
              </Text>
            </td>
            <td>
              <Badge
                color={
                  diffusionStatus(
                    item.attributes.startDate,
                    item.attributes.endDate
                  ) === "En cours de diffusion"
                    ? "green"
                    : diffusionStatus(
                        item.attributes.startDate,
                        item.attributes.endDate
                      ) === "En attente de diffusion"
                    ? "orange"
                    : diffusionStatus(
                        item.attributes.startDate,
                        item.attributes.endDate
                      ) === "Diffusion terminée" && "blue"
                }
                variant={theme.colorScheme === "dark" ? "light" : "outline"}
              >
                {diffusionStatus(
                  item.attributes.startDate,
                  item.attributes.endDate
                )}
              </Badge>
            </td>
            <td>
              <Group spacing={0} position="right">
                {item.attributes.tofacture === false ? (
                   <Tooltip label="Passer en facture" position="left" withArrow >
                  <ActionIcon
                    onClick={() => confirmationPutModal(item.id, toIncoice)}
                  >
                    <IconFileInvoice size="2rem" stroke={1.5} />
                  </ActionIcon>
                  </Tooltip>
                ) : (
                  <IconCheck size="2rem" stroke={1.5} color="green" />
                )}
                <ActionIcon onClick={() => handleModal(item)}>
                  <IconEye size="2rem" stroke={1.5} />
                </ActionIcon>
              </Group>
            </td>
          </tr>
        </React.Fragment>
      ));
  }, [commandeData, searchQuery, filterStatus]);
  
  return (
    <>
      <ScrollArea>
        <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Responsable de commande</th>
              <th>Numéro de commande</th>
              <th>Date de début</th>
              <th>Date de fin</th>
              <th>Total</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
      {selectedItem && (
        <Modal
          opened={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setUpdate(!update);
            setAuthenticationModal(true);
            setAuthentication(false);
            setInputAuthentication({
              username: "",
              password: "",
            });
          }}
          style={{ alignItems: "center", overflow: "visible" }}
          title={
            <Text fz="sm" fw={500}>
              Récapitulation
            </Text>
          }
          className="modalOrder"
          centered
        >
          <Text>
            Preuve de commande :{" "}
            <Anchor
              target="_blank"
              size="sm"
              href={`${urls.ForUpload}${selectedItem.attributes.evidence}`}
            >
              Cliquez ici
            </Anchor>{" "}
          </Text>
          <Modal
            opened={authenticationModal}
            onClose={() => {
              setAuthenticationModal(false);
            }}
            title={
              <Text fz="sm" fw={500}>
                Authentification
              </Text>
            }
          >
            <TextInput
              label="Nom d'utilisateur"
              placeholder="Entrez votre nom d'utilisateur"
              value={inputAuthentication.username}
              onChange={(e) => {
                setInputAuthentication((prevData) => {
                  return { ...prevData, username: e.target.value };
                });
              }}
            />
            <TextInput
              label="Mot de passe"
              placeholder="Entrez votre mot de passe"
              type="password"
              value={inputAuthentication.password}
              onChange={(e) => {
                setInputAuthentication((prevData) => {
                  return { ...prevData, password: e.target.value };
                });
                if (
                  inputAuthentication.username ===
                    authentificationcredential.username &&
                  inputAuthentication.password ===
                    authentificationcredential.password
                ) {
                  setAuthentication(true);
                  setAuthenticationModal(false);
                }
              }}
            />
          </Modal>
          {authentication && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text> </Text>
              <div style={{ display: "flex" }}>
                {update && (
                  <Button bg="green" onClick={() => updateOrderData()}>
                    Sauvegarder
                  </Button>
                )}
                <Button
                  bg="orange"
                  onClick={() => {
                    setUpdate(!update);
                    setModifiedData({
                      id: selectedItem.id,
                      endDate: selectedItem.attributes.endDate,
                      reference: selectedItem.attributes.reference,
                    });
                  }}
                >
                  Modifier
                </Button>
              </div>
            </div>
          )}
          {authentication &&
          update &&
          selectedItem.attributes.reference.length < 1 ? (
            <TextInput
              label="Numéro de commande"
              placeholder="Saisir numéro de commande"
              value={modifiedData.reference}
              onChange={(e) => {
                setModifiedData((prevData) => {
                  return { ...prevData, reference: e.target.value };
                });
              }}
            />
          ) : null}
          {authentication && update ? (
            <DateInput
              label="Date de fin"
              placeholder="Resaisir date de fin"
              value={new Date(modifiedData.endDate)}
              onChange={(e) => {
                setModifiedData((prevData) => {
                  return { ...prevData, endDate: e };
                });
                console.log(e);
              }}
            />
          ) : null}
          <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
            <thead>
              <tr>
                <th>Type de publicité</th>
                <th>Intitulé prestation</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Montant total</th>
                <th>Fichier</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {selectedItem.attributes.prestations.data.map((prestation) => (
                <tr key={prestation.id}>
                  <td>
                    <Text fz="sm" fw={500}>
                      {prestation.attributes.plateform}
                    </Text>
                  </td>
                  <td>
                    <Text size="sm">{prestation.attributes.servicename}</Text>
                  </td>
                  <td>
                    {authentication && update === true ? (
                      <NumberInput
                        hideControls
                        placeholder="Resaisir quantité"
                        value={prestation.attributes.quantity}
                        max={360}
                        min={1}
                        onChange={(value) => {
                          updatePrestationData(
                            prestation.id,
                            parseInt(value, 10)
                          );
                        }}
                      />
                    ) : (
                      <Text size="sm">{prestation.attributes.quantity}</Text>
                    )}
                  </td>
                  <td>
                    <Text size="sm">{prestation.attributes.unityprice}Ar</Text>
                  </td>
                  <td>
                    <Text size="sm">
                      {prestation.attributes.totalservice}Ar
                    </Text>
                  </td>
                  <td>
                    {prestation.attributes.plateform === "RADIO"
                      ? selectedItem.attributes.publicites.data
                          .filter((pub) =>
                            /\.(mp3|wav|ogg|flac|m4a|aac|wma|aiff)$/i.test(
                              pub.attributes.intitule
                            )
                          )
                          .map((pub) => (
                            <Anchor
                              key={pub.id}
                              size="sm"
                              href={`${urls.ForUpload}${pub.attributes.lien}`}
                            >
                              {pub.attributes.intitule}
                            </Anchor>
                          ))
                      : selectedItem.attributes.publicites.data
                          .filter((pub) =>
                            /\.(mp4|avi|mkv|mov|wmv|flv|webm|mpeg|mpg)$/i.test(
                              pub.attributes.intitule
                            )
                          )
                          .map((pub) => (
                            <Anchor
                              key={pub.id}
                              size="sm"
                              href={`${urls.ForUpload}${pub.attributes.lien}`}
                            >
                              {pub.attributes.intitule}
                            </Anchor>
                          ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {successSubmit ? (
            <Notification
              icon={checkIcon}
              onClose={() => {
                setSuccessSubmit(false);
                location.reload();
              }}
              color="teal"
              title="Bummer!"
            >
              Mise à jour bien effectuée
            </Notification>
          ) : error ? (
            <Notification
              icon={xIcon}
              color="red"
              onClose={() => {
                setError(false);
              }}
              title="Bummer!"
            >
              Une erreur s'est produite
            </Notification>
          ) : null}
        </Modal>
      )}
    </>
  );
}
