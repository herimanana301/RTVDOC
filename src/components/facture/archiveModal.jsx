import React, { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, ScrollArea, Table } from "@mantine/core";
import { useForm, isNotEmpty, hasLength, matches } from "@mantine/form";
import { FetchAllCommandeArchived } from "./hanldeFacture";
import ModalCommande from "./FactureModal";
import {
  Group,
  TextInput,
  NumberInput,
  Box,
  Textarea,
  Select,
  SimpleGrid,
  Switch,
  Text,
  Badge,
  useMantineTheme,
  Autocomplete,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconSearch } from "@tabler/icons-react";

export default function ArchiveModal() {
  const [opened, { open, close }] = useDisclosure(false);

  const [IsrefreshArchive, setIsrefreshArchive] = useState(false);
  const [search, setSearch] = useState("");
  const [datasCommandeArchived, setDatasCommandeArchived] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 1,
  });

  const theme = useMantineTheme();

  useEffect(() => {
    FetchAllCommandeArchived(
      setDatasCommandeArchived,
      setPagination,
      pagination.page,
      setIsrefreshArchive
    );
  }, [opened, pagination.page]);

  useEffect(() => {
    FetchAllCommandeArchived(
      setDatasCommandeArchived,
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

  const filterData = datasCommandeArchived.filter((data) =>
    search.length > 0
      ? data.attributes.reference
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        data.attributes.client.data.attributes.raisonsocial
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        data.attributes.startDate
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        data.attributes.endDate.toLowerCase().includes(search.toLowerCase()) ||
        data.attributes.payement.data.attributes.typePayement
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        data.attributes.responsableCommande
          .toLowerCase()
          .includes(search.toLowerCase())
      : true
  );

  const rows = filterData.map((Commande) => (
    <tr key={Commande.id}>
      <td>{Commande.attributes.reference}</td>
      <td>{Commande.attributes.client.data.attributes.raisonsocial}</td>
      <td>
        Du {formatDate(Commande.attributes.startDate)} au{" "}
        {formatDate(Commande.attributes.endDate)}
      </td>
      <td>{Commande.attributes.responsableCommande}</td>
      <td>
        {" "}
        <Badge
          color={
            Commande.attributes.payement.data
              ? Commande.attributes.payement.data.attributes.typePayement ===
                "Totalement-payé"
                ? "green"
                : Commande.attributes.payement.data.attributes.typePayement ===
                  "Partiellement-payé"
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
          <ModalCommande
            datas={{ id: Commande.id, archive: Commande.attributes.archive }}
          />
        </Group>
      </td>
    </tr>
  ));

  return (
    <>
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
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Autocomplete
            placeholder="Rechercher"
            icon={<IconSearch size="1rem" stroke={1.5} />}
            data={[]}
            style={{ width: "400px" }}
            value={search}
            onChange={(e) => setSearch(e)}
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
        </div>
        <ScrollArea>
          <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
            <thead>
              <tr>
                <th>Référence BC</th>
                <th>Client</th>
                <th>Période de diffusion</th>
                <th>Responsable commande</th>
                <th>Status du payement</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </Modal>
    </>
  );
}
