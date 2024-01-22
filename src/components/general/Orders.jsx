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

const stateColors = {
  engineer: "blue",
  manager: "cyan",
  designer: "pink",
};

const fetchCommandeData = async () => {
  try {
    const response = await axios.get(`${urls.StrapiUrl}api/commandes?populate=*`)
    console.log(response)
    return response.data.data;
  } catch (error) {
    console.error('Error fetching data from Strapi:', error);
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
            <Avatar size={30} src={item.avatar} radius={30} />
            <Text fz="sm" fw={500}>
              {item.attributes.prestations.data[0].attributes.servicename.split(' ').map((word, index) => (
                <React.Fragment key={index}>
                  {word}
                  <br />
                </React.Fragment>
              ))}
            </Text>
          </Group>
        </td>
        <td>
          <Text size="sm">{item.attributes.startDate}</Text>
        </td>
        <td>
          <Text size="sm">{item.attributes.endDate}</Text>
        </td>
        <td>
          <Text size="sm">{ item.attributes.prestations.data[0].attributes.quantity }</Text>
        </td>
        <td>
          <Text size="sm"> { item.attributes.prestations.data[0].attributes.unityprice }</Text>
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
          <Text size="sm"> { item.attributes.prestations.data[0].attributes.quantity * item.attributes.prestations.data[0].attributes.unityprice } </Text>
        </td>
        <td>
          <Text size="sm"> { item.attributes.client.data.attributes.raisonsocial }</Text>
        </td>
        <td>
          <Text size="sm"> { item.attributes.responsableCommande } </Text>
        </td>
        <td>
          <Group spacing={0} position="right">
            <ActionIcon onClick={() => handleModal(item)}>
              <IconBolt size="1rem" stroke={1.5}/>
            </ActionIcon>
          </Group>
        </td>
      </tr>

      {/* Modal */}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        style={{ alignItems: 'center'}}
        title={<Text fz="sm" fw={500}>Récapitulation</Text>}
        centered
      >

        <Text size="sm">
          
          <Text>Type de publicité : {item.attributes.prestations.data[0].attributes.plateform}</Text>
          <Text>Durée de la diffusion : {item.attributes.prestations.data[0].attributes.quantity} jours</Text>
          {/* <Text>Fréquence : Lundi, 19h00, après 1re série</Text> */}
          <Text>
            Nom du fichier : <Anchor component="button">{item.attributes.publicites.data[0].attributes.intitule}</Anchor>{" "}
          </Text>
        
        </Text>
        
      </Modal>
    </>    
    ));

  return (
    <>
    <ScrollArea>
      <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
        <thead>
          <tr>
            <th> Nom </th>
            {/*<th>Récapitulation</th>*/}
            <th>Date de début</th>
            <th>Date de fin</th>
            <th>Qte</th>
            <th>P.U.</th>
            <th>Status</th>
            <th>Montant</th>
            <th>Client</th>
            <th>Responsable de commande</th>
            <th />
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
    
    </>
  );
}



