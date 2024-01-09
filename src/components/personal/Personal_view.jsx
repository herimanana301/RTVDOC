import { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Menu,
  NativeSelect,
  Table,
  ScrollArea,
  Group,
  Text,
  Avatar,
} from "@mantine/core";
import { IconSearch, IconFilter } from "@tabler/icons-react";
import axios from "axios";

export default function Personal_view() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    total: 1,
  });
  const [datas, setDatas] = useState([]);
  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };
  useEffect(() => {
    axios
      .get("http://192.168.88.12:1337/api/personnels/")
      .then((response) => {
        console.log(response.data.data[0].attributes);
        setDatas(response.data.data);
        setPageInfo((prevdata) => ({
          ...prevdata,
          total: response.data.meta.pagination.total,
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const rows = datas.map((item) => (
    <tr key={item.attributes.NIF}>
      <td>
        <Group spacing="sm">
          <Avatar size={30} src={item.avatar} radius={30} />
          <Text fz="sm" fw={500}>
            {item.attributes.nom}<br/>

            <Text fz="xs" c="dimmed">
            {item.attributes.prenom}
            </Text>
            
          </Text>
        </Group>
      </td>

      <td>
        <Text fz="xs" c="dimmed">
          {item.attributes.adresse}
        </Text>
      </td>
      <td>
        <Text fz="xs" c="dimmed">
          {item.attributes.contact}
        </Text>
      </td>
      <td>
        <Text fz="xs" c="dimmed">
          {item.attributes.email}
        </Text>
      </td>
      <td>
        <Text fz="xs" c="dimmed">
          {item.attributes.poste}
        </Text>
      </td>
      <td>
        <Text fz="xs" c="dimmed">
          {item.attributes.status}
        </Text>
      </td>

    </tr>
  ));
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button component="a" href="/newpersonal">
          + Nouveau
        </Button>
        <Autocomplete
          placeholder="Rechercher"
          icon={<IconSearch size="1rem" stroke={1.5} />}
          data={[]}
        />
        <Menu
          shadow="md"
          width={"auto"}
          position="left"
          offset={5}
          opened={menuVisible}
        >
          <Menu.Target>
            <Button onClick={handleMenuToggle}>
              <IconFilter size="1.1rem" stroke={2} />
              Filtre
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item>
              <NativeSelect
                data={["", "En attente de diffusion", "En cours de diffusion"]}
                label="État de diffusion"
                radius="md"
              />
            </Menu.Item>
            <Menu.Item>
              <NativeSelect
                data={["", "Payé", "Non Payé"]}
                label="Ètat de paiement"
                radius="md"
              />
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      <ScrollArea>
        <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
          <thead>
            <tr>
              <th>Identité</th>
              <th>Adresse</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Poste</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
