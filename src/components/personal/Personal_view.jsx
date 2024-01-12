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
  rem,
  ActionIcon,
  Avatar,
} from "@mantine/core";

import {
  IconPencil,
  IconTrash,
} from '@tabler/icons-react';

import { IconSearch, IconFilter } from "@tabler/icons-react";
import axios from "axios";
import { Link } from "react-router-dom";
import confirmationModal from "../../services/alertConfirmation";
import Swal from 'sweetalert2';


export default function Personals() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    total: 1,
  });

  let StrapiUrl = "http://192.168.0.101:1337/";

  const [datas, setDatas] = useState([]);
  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };

  useEffect(() => {
    axios
      .get(StrapiUrl+"api/personnels")
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

  /*************** Delete personal data *********************/

  const deletedUser = async (id) => {
    try {
      const response = await axios.delete(StrapiUrl+`api/personnels/${id}`);
      console.log('Delete Response:', response); // Vérifiez la réponse ici
      if (response.status == 200) { // Assurez-vous de vérifier la réponse appropriée pour votre API

        setDatas((prevData) => {
          const newData = prevData.filter((data) => data.id !== response.data.data.id);
          return newData;
        });

        Swal.fire(
          'Supprimé!',
          'Personnel supprimé avec succès.',
          'success'
        );
      }
    } catch (error) {
      console.error('Delete Error:', error);
    }
  };

  const rows = datas.map((item) => (
    <tr key={item.attributes.idPersonnel}>
      <td>
        <Group gap="sm">
          <Avatar size={50} radius={50} src={StrapiUrl+'uploads/' + item.attributes.avatar} />
          <Text fz="sm" fw={500}>
            {item.attributes.nom} {item.attributes.prenom}<br />
            <Text fz="xs" c="dimmed">
              {item.attributes.contact}
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

      <td>
        <Group gap={0} justify="flex-end">
          <ActionIcon variant="subtle" color="gray">
            <Link
              to={{
                pathname: `/personal/${item.id}`,
              }}
              state={{ personalDatas: item.attributes }}
            >
              <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </Link>
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray" onClick={() => { confirmationModal(item.id, deletedUser) }}>
            <IconTrash style={{ width: rem(16), height: rem(16), color: 'red' }} stroke={1.5} />
          </ActionIcon>

        </Group>
      </td>

    </tr>
  ));

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button component="a" href="/personal">
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
              <th>Email</th>
              <th>Poste</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>

      </ScrollArea>
    </>
  );
}
