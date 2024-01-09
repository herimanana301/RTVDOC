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

export default function Clients() {
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
      .get("http://localhost:1337/api/clients/")
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
        <Group gap="sm">
          <div>
            <Text fz="sm" fw={500}>
              {item.attributes.raisonsocial}
            </Text>
          </div>
        </Group>
      </td>
      <td>
        <Text fz="xs" c="dimmed">
          {item.attributes.phonenumber}
        </Text>
      </td>
      <td>
        <Text fz="xs" c="dimmed">
          {item.attributes.email}
        </Text>
      </td>
      <td>
        <Text fz="sm" fw={500}>
          {item.attributes.adresse}
        </Text>
      </td>
      <td>{item.attributes.NIF}</td>
      <td>{item.attributes.STAT}</td>
    </tr>
  ));
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button component="a" href="/newclient">
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
              <th> Nom (ou Raison social) </th>
              <th>Numéro tel</th>
              <th>Adresse email</th>
              <th>Adresse</th>
              <th>NIF</th>
              <th>STAT</th>
              <th />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
