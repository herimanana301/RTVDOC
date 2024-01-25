import React, { useEffect, useState } from "react";
import {
  ActionIcon,
  Autocomplete,
  Button,
  Group,
  Menu,
  NativeSelect,
  ScrollArea,
  Table,
} from "@mantine/core";
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
} from "@tabler/icons-react";

export default function Facture() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [paymentStatus, setPaymentStatus] = useState("");

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
    return `${year}-${month}-${day}`;
  };

  const filteredRows = datasCommande
    .filter(
      (Commande) =>
        Commande.attributes.reference
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        Commande.attributes.client.data.attributes.raisonsocial
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        Commande.attributes.responsableCommande
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    )
    .filter(
      (Commande) =>
        paymentStatus === "" ||
        (Commande.attributes.payement.data &&
          Commande.attributes.payement.data.attributes.typePayement ===
            paymentStatus)
    )
    .map((Commande) => (
      <tr key={Commande.id}>
        <td>{Commande.attributes.reference}</td>
        <td>{Commande.attributes.client.data.attributes.raisonsocial}</td>
        <td>
          Du {formatDate(Commande.attributes.startDate)} au{" "}
          {formatDate(Commande.attributes.endDate)}
        </td>
        <td>{Commande.attributes.responsableCommande}</td>
        <td>
          {Commande.attributes.payement.data
            ? Commande.attributes.payement.data.attributes.typePayement
            : "Non-payé"}
        </td>
        <td>
          <Group spacing={0} position="right">
            <FactureModal
              datas={{ id: Commande.id, archive: Commande.attributes.archive }}
            />
          </Group>
        </td>
      </tr>
    ));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <ArchiveModal />

        <Autocomplete
          placeholder="Rechercher"
          icon={<IconSearch size="1rem" stroke={1.5} />}
          data={[]}
          value={searchQuery}
          onChange={(value) => setSearchQuery(value)}
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
                data={["", "Totalement-payé", "Partiellement-payé", "Non-Payé"]}
                value={paymentStatus}
                label="État de paiement"
                radius="md"
                onChange={(e) => setPaymentStatus(e.target.value)}
              />
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>

      <br />

      <ScrollArea>
        <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
          <thead>
            <tr>
              <th>Référence BC</th>
              <th>Client</th>
              <th>Période de diffusion</th>
              <th>Responsable commande</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>{filteredRows}</tbody>
        </Table>
      </ScrollArea>
    </div>
  );
}
