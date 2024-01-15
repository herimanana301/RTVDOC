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
  Modal,
} from "@mantine/core";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import checked from "../../assets/icons/checked.gif";
import wrong from "../../assets/icons/wrong.gif";
import { IconSearch, IconFilter } from "@tabler/icons-react";
import confirmationModal from "../../services/alertConfirmation";
import Swal from "sweetalert2";
import axios from "axios";
import { Link } from "react-router-dom"; // Pour gérer les redirection vers les liens déclarer dans App.jsx
import { getClients } from "../../services/getInformations/getClients"; // service pour récupérer les clients, format --> getClients(setPageInfo, setDatas)
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
    getClients(setPageInfo, setDatas);
  }, []);
  const deletedUser = async (id) => {
    await axios
      .delete(`http://192.168.0.100:1337/api/clients/${id}`)
      .then((response) => {
        if (response) {
          Swal.fire("Supprimé!", "Client supprimé avec succès.", "success");

          setDatas((prevData) => {
            const newData = prevData.filter(
              (data) => data.id != response.data.data.id
            );
            return newData;
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const rows = datas.map((item) => (
    <tr key={item.attributes.NIF}>
      <td>
        <Group gap="sm">
          <div>
            <Text fz="sm" fw={500}>
              {item.attributes.blacklist && (
                <IconAlertTriangleFilled style={{ color: "red" }} />
              )}
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
      <td>
        <Group>
          <Link
            to={{
              pathname: `/client/${item.id}`,
            }}
            state={{ clientDatas: item.attributes }}
          >
            <Button style={{ backgroundColor: "orange" }}>Modifer</Button>
          </Link>
          <Button
            onClick={() => {
              confirmationModal(item.id, deletedUser);
            }}
            style={{ backgroundColor: "red" }}
          >
            Supprimer
          </Button>
        </Group>
      </td>
    </tr>
  )); // Structuration et affichage des données reçues

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button component="a" href="/client">
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
              <th style={{ display: "flex", justifyContent: "center" }}>
                Action
              </th>
              <th />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
