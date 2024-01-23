import React, { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button,ScrollArea,Table } from "@mantine/core";
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
  Switch
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";

export default function ArchiveModal() {
  const [opened, { open, close }] = useDisclosure(false);
  
  const [datasCommandeArchived, setDatasCommandeArchived] = useState([]);
  const [pageInfoArchive, setPageInfoArchive] = useState({
    page: 1,
    total: 1,
  });

  useEffect(() => {
    FetchAllCommandeArchived(setDatasCommandeArchived, setPageInfoArchive);
  }, [opened]);

  const formatDate = (date) => {
  
    const date1 = new Date(date);

    const year = date1.getFullYear();
    const month = (date1.getMonth() + 1).toString().padStart(2, "0");
    const day = date1.getDate().toString().padStart(2, "0");

    return `${day}-${month}-${year}`;
  };

  const rows = datasCommandeArchived.map((Commande) => (
   console.log(Commande)
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
        title="Archive BC"
        overlayProps={{
          backgroundopacity: 0.55,
          blur: 3,
        }}
        size="80%"
        style={{marginLeft:'-95px'}}
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
