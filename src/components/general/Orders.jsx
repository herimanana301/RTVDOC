import React, { useState } from 'react';
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

const stateColors = {
  engineer: "blue",
  manager: "cyan",
  designer: "pink",
};

export default function Orders() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModal = () => {
    setIsModalOpen(true);
  }
  
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

  const data = [
    {
      avatar: "https://example.com/avatar/1",
      name: "Pub AKAMA FULL",
      state: "En cours de diffusion",
      email: "john.doe@example.com",
      phone: "+1234567890",
      dateDebut :"2023-12-18",
      dateFin : "2024-01-17",
      qte: "70",
      pu: "10000",
      responsable: "Orange Madagascar",
    },
    {
      avatar: "https://example.com/avatar/2",
      name: "Pub YELLOW 200",
      state: "En attente de paiement",
      email: "jane.smith@example.com",
      phone: "+0987654321",
      dateDebut: "2024-11-27",
      dateFin: "2024-12-27",
      qte: "50",
      pu: "10000",
      responsable: "Telma",
    },
  ];

  const theme = useMantineTheme();
  const rows = data.map((item) => (
    <tr key={item.name}>
      <td>
        <Group spacing="sm">
          <Avatar size={30} src={item.avatar} radius={30} />
          <Text fz="sm" fw={500}>
            {item.name.split(' ').map((word, index) => (
              <React.Fragment key={index}>
                {word}
                <br />
              </React.Fragment>
            ))}
          </Text>
        </Group>
      </td>
      <td>
        <Text size="sm">{item.dateDebut}</Text>
      </td>
      <td>
        <Text size="sm">{item.dateFin}</Text>
      </td>
      <td>
        <Text size="sm">{ item.qte }</Text>
      </td>
      <td>
        <Text size="sm"> { item.pu }</Text>
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
        <Text size="sm"> { item.qte * item.pu } </Text>
      </td>
      <td>
        <Text size="sm"> { item.responsable } </Text>
      </td>
      <td>
        <Group spacing={0} position="right">
          <ActionIcon onClick={ handleModal }>
            <IconBolt size="1rem" stroke={1.5}/>
          </ActionIcon>
        </Group>
      </td>
    </tr>
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
            <th>Responsable de commande</th>
            <th />
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
    {/* Modal */}
    <Modal
      opened={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      style={{ alignItems: 'center'}}
      title={<Text fz="sm" fw={500}>Récapitulation</Text>}
      centered
    >

      <Text size="sm">
        
        <Text>Type de publicité :</Text>
        <Text>Durée de la diffusion :</Text>
        <Text>Fréquence : Lundi, 19h00, après 1re série</Text>
        <Text>
          Nom du fichier : <Anchor component="button">test.mp4</Anchor>{" "}
        </Text>
      
      </Text>
    </Modal>
    </>
  );
}



