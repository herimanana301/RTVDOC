import React, { useEffect, useState } from "react";
import {
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
  Modal
} from "@mantine/core";
import { IconSearch, IconFilter } from "@tabler/icons-react";
import FactureModal from "./FactureModal";
import { useDisclosure } from "@mantine/hooks";
import { FetchAllFactureArchived } from "./hanldeFacture";

export default function ArchiveModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const [IsrefreshArchive, setIsrefreshArchive] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [paymentStatus, setPaymentStatus] = useState("");
  const theme = useMantineTheme();

  const [menuVisible, setMenuVisible] = useState(false);
  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };

  const [datasFactureArchived, setDatasFactureArchived] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 1,
  });

  useEffect(() => {
    FetchAllFactureArchived(
      setDatasFactureArchived,
      setPagination,
      pagination.page,
      setIsrefreshArchive
    );
  }, [pagination.page]);

  useEffect(() => {
    FetchAllFactureArchived(
      setDatasFactureArchived,
      setPagination,
      pagination.page,
      setIsrefreshArchive
    );
    setIsrefreshArchive(false);
  }, [IsrefreshArchive]);

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

  const filteredRows = datasFactureArchived
    .filter(
      (Facture) =>
        Facture.reference
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        Facture.raisonSocial
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        Facture.responsableCommande
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    )

    .map((Facture) => (
      <tr key={Facture.idFacture}>
        <td>{Facture.idFacture}</td>
        <td>{Facture.raisonSocial}</td>
        <td>{Facture.reference}</td>
        <td>
          Du {formatDate(Facture.startDate)} au{" "}
          {formatDate(Facture.endDate)}
        </td>
        <td>{Facture.responsableCommande}</td>
        <td>{Facture.refFacture}</td>
        <td>
          <Badge
            color={
              Facture.typePayement === "Totalement-payé" ? "green"
                : Facture.typePayement === "Partiellement-payé" ? "yellow" : "gray"
            }
            variant={theme.colorScheme === "dark" ? "light" : "filled"}
          >
            {Facture.typePayement}
          </Badge>
        </td>
        <td>
          <Group spacing={0} position="right">
            <FactureModal
              datas={{ id: Facture.id, archive: Facture.archive }}
            />
          </Group>
        </td>
      </tr>
    ));

  return (
    <div>
      <Button
        onClick={() => {
          open();
        }}
      >
        Archive
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        title="Liste des archives"
        overlayProps={{
          backgroundopacity: 0.55,
          blur: 3,
        }}
        size="80%"
        style={{ marginLeft: "-95px" }}
      >
        <div style={{marginTop:10}}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                  <th>ID</th>
                  <th>Client</th>
                  <th>Référence BC</th>
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
      </Modal>
    </div>
  );
}
