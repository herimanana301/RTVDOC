import React, { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, ScrollArea, Table } from "@mantine/core";
import { useForm, isNotEmpty, hasLength, matches } from "@mantine/form";
import { FetchAllCommandeArchived } from "./hanldeFacture"
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
  Badge,
  useMantineTheme
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";

export default function ArchiveModal() {
  const [opened, { open, close }] = useDisclosure(false);

  const [datasCommandeArchived, setDatasCommandeArchived] = useState([]);
  const [pageInfoArchive, setPageInfoArchive] = useState({
    page: 1,
    total: 1,
  });
  const theme = useMantineTheme();

  useEffect(() => {
    FetchAllCommandeArchived(setDatasCommandeArchived, setPageInfoArchive);
  }, [opened]);

  const formatDate = (date) => {

    const date1 = new Date(date);

    const year = date1.getFullYear();
    const month = (date1.getMonth() + 1).toString().padStart(2, "0");
    const day = date1.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const rows = datasCommandeArchived.map((Commande) => (
    <tr key={Commande.id}>
      <td>{Commande.attributes.reference}</td>
      <td>{Commande.attributes.client.data.attributes.raisonsocial}</td>
      <td>Du {formatDate(Commande.attributes.startDate)} au {formatDate(Commande.attributes.endDate)}</td>
      <td>{Commande.attributes.responsableCommande}</td>
      <td> <Badge
        color={
          Commande.attributes.payement.data
            ? Commande.attributes.payement.data.attributes.typePayement === "Totalement-payé"
              ? "green"
              : Commande.attributes.payement.data.attributes.typePayement === "Partiellement-payé"
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
            <ModalCommande datas={{ id: Commande.id, archive: Commande.attributes.archive }} />
          </Group>
        </td>

      </tr>
        ))




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
            style={{ marginLeft: '-95px' }}
          >

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
