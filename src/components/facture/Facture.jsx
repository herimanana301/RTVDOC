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
  Badge,
  useMantineTheme,
  Text,
} from "@mantine/core";
import { IconSearch, IconFilter } from "@tabler/icons-react";
import { IconBolt } from "@tabler/icons-react";
import FactureModal from "./FactureModal";
import FetchAllCommande from "./hanldeFacture";
import ArchiveModal from "./archiveModal";

export default function Facture() {
  const [Isrefresh, setIsrefresh] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [paymentStatus, setPaymentStatus] = useState("");
  const theme = useMantineTheme();

  const [menuVisible, setMenuVisible] = useState(false);
  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };

  const [datasCommande, setDatasCommande] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 1,
  });

  useEffect(() => {
    FetchAllCommande(
      setDatasCommande,
      setPagination,
      pagination.page,
      setIsrefresh
    );
  }, [pagination.page]);

  useEffect(() => {
    FetchAllCommande(
      setDatasCommande,
      setPagination,
      pagination.page,
      setIsrefresh
    );
    setIsrefresh(false);
  }, [Isrefresh]);

  const handlePagination = (type) => {
    if (type === "next" && pagination.page <= pagination.pageSize) {
      setPagination((prevdata) => {
        return {
          ...prevdata,
          page: pagination.page + 1,
        };
      });
    } else if (type === "prev" && pagination.page > 0) {
      setPagination((prevdata) => {
        return { ...prevdata, page: pagination.page - 1 };
      });
    }
  };
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
        <td>{Commande.attributes.payement.data &&
          Commande.attributes.payement.data.attributes.refFacture}</td>
        <td>
          <Badge
            color={
              Commande.attributes.payement.data
                ? Commande.attributes.payement.data.attributes.typePayement ===
                  "Totalement-payé"
                  ? "green"
                  : Commande.attributes.payement.data.attributes
                    .typePayement === "Partiellement-payé"
                    ? "yellow"
                    : "gray"
                : "gray"
            }
            variant={theme.colorScheme === "dark" ? "light" : "filled"}
          >
            {Commande.attributes.payement.data
              ? Commande.attributes.payement.data.attributes.typePayement
              : "Non-payé"}
          </Badge>
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
        <div>
          <Button
            onClick={() => {
              handlePagination("prev");
            }}
            disabled={pagination.page === 1 ? true : false}
          >
            {"<"}
          </Button>
          <Button
            onClick={() => {
              handlePagination("next");
            }}
            disabled={pagination.page === pagination.pageSize ? true : false}
          >
            {">"}
          </Button>
        </div>
        <Text>
          Page {pagination.page}/{pagination.pageSize}
        </Text>

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
              <th>Facture n°</th>
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
