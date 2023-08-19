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

const stateColors = {
  engineer: "blue",
  manager: "cyan",
  designer: "pink",
};

export default function Orders() {
  const data = [
    {
      avatar: "https://example.com/avatar/1",
      name: "Herimanana Rasolonirina",
      state: "En cours de diffusion",
      email: "john.doe@example.com",
      phone: "+1234567890",
    },
    {
      avatar: "https://example.com/avatar/2",
      name: "Telma",
      state: "En attente de paiement",
      email: "jane.smith@example.com",
      phone: "+0987654321",
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
        <Text size="sm">27/07/2023</Text>
      </td>
      <td>
        <Badge
          color={stateColors[item.state.toLowerCase()]}
          variant={theme.colorScheme === "dark" ? "light" : "outline"}
        >
          En cours de diffusion
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
            <th>Date</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
