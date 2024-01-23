import React, { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Table,
  Group,
  Text,
  ActionIcon,
  Anchor,
  ScrollArea,
  Modal,
  useMantineTheme,
} from "@mantine/core";
import { IconBolt } from "@tabler/icons-react";
import urls from "../../services/urls";
import axios from "axios";
import "./order.css";

const stateColors = {
  engineer: "blue",
  manager: "cyan",
  designer: "pink",
};

const fetchCommandeData = async () => {
  try {
    const response = await axios.get(
      `${urls.StrapiUrl}api/commandes?populate=*&_limit=-1`
    );
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Strapi:", error);
    return [];
  }
};

export default function Orders() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commandeData, setCommandeData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCommandeData();
      setCommandeData(data);
    };

    fetchData();
  }, []);

  const handleModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
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

  const rows = commandeData.map((item, index) => (
    <>
      <tr key={index}>
        <td>
          <Group spacing="sm">
            <Text fz="sm" fw={500}>
              {item.attributes.client.data.attributes.raisonsocial.includes(" ")
                ? item.attributes.client.data.attributes.raisonsocial
                    .split(" ")
                    .map((word, index) => (
                      <React.Fragment key={index}>
                        {word}
                        <br />
                      </React.Fragment>
                    ))
                : item.attributes.client.data.attributes.raisonsocial}
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
            color={stateColors[diffusionStatus]}
            variant={theme.colorScheme === "dark" ? "light" : "outline"}
          >
            {diffusionStatus(item.dateDebut, item.dateFin)}
          </Badge>
        </td>
        <td>
          <Group spacing={0} position="right">
            <ActionIcon onClick={() => handleModal(item)}>
              <IconBolt size="1rem" stroke={1.5} />
            </ActionIcon>
          </Group>
        </td>
      </tr>

      {/* Modal */}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        style={{ alignItems: "center", overflow: "visible" }}
        title={
          <Text fz="sm" fw={500}>
            Récapitulation
          </Text>
        }
        className="modalOrder"
        centered
      >
        <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
          <thead>
            <tr>
              <th>Type de publicité </th>
              <th>Intitulé prestation</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
              <th>Montant total</th>
              <th>Fichier</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {item.attributes.prestations.data.map((prestation) => (
              <tr key={index}>
                <td>
                  <Text fz="sm" fw={500}>
                    {prestation.attributes.plateform}
                  </Text>
                </td>
                <td>
                  <Text size="sm"> {prestation.attributes.servicename} </Text>
                </td>
                <td>
                  <Text size="sm"> {prestation.attributes.quantity} </Text>
                </td>
                <td>
                  <Text size="sm">{prestation.attributes.unityprice}Ar</Text>
                </td>
                <td>
                  <Text size="sm">{prestation.attributes.totalservice}Ar</Text>
                </td>
                <td>
                  {/*                   {item.attributes.publicites.data.map((pub) => {
                    prestation.attributes.plateform === "RADIO" &&
                    /\.(mp3|wav|ogg|flac|m4a|aac|wma|aiff)$/i.test(
                      pub.attributes.intitule
                    ) ? (
                      <Anchor
                        size="sm"
                        href={`${urls.ForUpload}${pub.attributes.lien}`}
                      >
                        {pub.attributes.intitule}
                      </Anchor>
                    ) : (
                      <Anchor
                        size="sm"
                        href={`${urls.ForUpload}${pub.attributes.lien}`}
                      >
                        {pub.attributes.intitule}
                      </Anchor>
                    );
                  })} */}
                  {prestation.attributes.plateform === "RADIO"
                    ? item.attributes.publicites.data
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
                    : item.attributes.publicites.data
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
      </Modal>
    </>
  ));

  return (
    <>
      <ScrollArea>
        <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
          <thead>
            <tr>
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
    </>
  );
}
