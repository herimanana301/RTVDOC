import { useEffect, useState } from "react";
import {
  ActionIcon, Autocomplete, Button, Group,
  Menu, NativeSelect, ScrollArea, Table
}
  from "@mantine/core";
import { IconSearch, IconFilter } from "@tabler/icons-react";
import { IconBolt } from "@tabler/icons-react";
import FactureModal from "./FactureModal";
import FetchAllCommande from "./hanldeFacture";
import ArchiveModal from "./archiveModal";
import {
  IconPencil,
  IconMessages,
  IconNote,
  IconReportAnalytics,
  IconTrash,
  IconDots,
} from '@tabler/icons-react';

export default function Facture() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [menuVisible, setMenuVisible] = useState(false);
  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };

  const [datasCommande, setDatasCommande] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    total: 1,
  });


  useEffect(() => {
    FetchAllCommande(setDatasCommande, setPageInfo);
  }, []);

  const formatDate = (date) => {
  
    const date1 = new Date(date);

    const year = date1.getFullYear();
    const month = (date1.getMonth() + 1).toString().padStart(2, "0");
    const day = date1.getDate().toString().padStart(2, "0");

    return `${day}/${month}/${year}`;
  };

  const rows = datasCommande.map((Commande) => (
      <tr key={Commande.id}>
      <td>{Commande.attributes.reference}</td>
      <td>{Commande.attributes.client.data.attributes.raisonsocial}</td>
      <td>Du {formatDate(Commande.attributes.startDate)} au {formatDate(Commande.attributes.endDate)}</td>
      <td>{Commande.attributes.responsableCommande}</td>
      <td>{Commande.attributes.status}</td>

      <td>
        <Group spacing={0} position="right">
        <FactureModal datas={Commande.id}/>
        </Group>
      </td>

    </tr>
  ))

  const handlePrint = () => {
    console.log('Printed !');
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>

      <ArchiveModal />

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
                data={["", "En attente de diffusion", "En cours de diffusion", "Diffusion terminée"]}
                label="État de diffusion"
                radius="md"
              />
            </Menu.Item>
            <Menu.Item>
              <NativeSelect
                data={["", "Payé", "Non Payé"]}
                label="État de paiement"
                radius="md"
              />
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      {/* Table */}
      <ScrollArea>
        <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
          <thead>
            <tr>
              <th>Référence BC</th>
              <th>Client</th>
              <th>Période de diffusion</th>
              <th>Responsable commande</th>
              <th>Status payement</th>
              <th />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
      
    </div>
  );
}
