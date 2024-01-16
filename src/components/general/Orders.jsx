import {
  Avatar,
  Badge,
  Table,
  Group,
  Text,
  ActionIcon,
  Anchor,
  ScrollArea,
  useMantineTheme,
} from "@mantine/core";
import { IconBolt } from "@tabler/icons-react";
import { getCurrentDate } from "./Utils";

const stateColors = {
  engineer: "blue",
  manager: "cyan",
  designer: "pink",
};

export default function Orders() {
  
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
      name: "Herimanana Rasolonirina",
      state: "En cours de diffusion",
      email: "john.doe@example.com",
      phone: "+1234567890",
      dateDebut :"20/01/2024",
      dateFin : "31/01/2024",
    },
    {
      avatar: "https://example.com/avatar/2",
      name: "Telma",
      state: "En attente de paiement",
      email: "jane.smith@example.com",
      phone: "+0987654321",
      dateDebut: "27/11/2023",
      dateFin: "27/12/2023",
    },
  ];

  const theme = useMantineTheme();
  const rows = data.map((item) => (
    
    <tr key={item.name}>
      <td>
        <Group spacing="sm">
          <Avatar size={30} src={item.avatar} radius={30} />
          <Text fz="sm" fw={500}>
            {item.name}
          </Text>
        </Group>
      </td>

      <td>
        <Text>Type de publicité :</Text>
        <Text>Durée de la diffusion :</Text>
        <Text>Fréquence :</Text>
        <Text>
          Nom du fichier : <Anchor component="button">test.mp4</Anchor>{" "}
        </Text>
      </td>
      <td>
        <Text size="sm">{ item.dateDebut }</Text>
      </td>
      <td>
        <Text size="sm">{ item.dateFin }</Text>
      </td>
      <td>
            <Badge
              color={stateColors[diffusionStatus]}
              variant={theme.colorScheme === "dark" ? "light" : "outline"}
            >
              { diffusionStatus(item.dateDebut, item.dateFin) }
            </Badge>
      </td>
      <td>
        <Group spacing={0} position="right">
          <ActionIcon>
            <IconBolt size="1rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ));

  return (
    <ScrollArea>
      <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
        <thead>
          <tr>
            <th> Nom </th>
            <th>Récapitulation</th>
            <th>Date de début</th>
            <th>Date de fin</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
