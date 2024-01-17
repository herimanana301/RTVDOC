// AjoutCongeModal.js
import React, { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import { useForm, isNotEmpty, hasLength, matches } from "@mantine/form";
import {
  Group,
  TextInput,
  NumberInput,
  Box,
  Textarea,
  Select,
  SimpleGrid,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { InsertConge } from "./handle_conge";
import "./css/modal_nouveau.css";

export default function AjoutCongeModal({ datas }) {
  const [opened, { open, close }] = useDisclosure(false);

  const identite = Object.values(datas).map((data) => {
    return data.attributes; // Assurez-vous que data.attributes contient les informations nécessaires
  });
  /*********************** Valeur du dropdown *************************/

  const [valeurSelectionnee, setValeurSelectionnee] = useState("");
  const [GetPersonnel, setGetPersonnel] = useState({});

  const handleSelectChange = (selectedOption) => {
    setSelection(false);
    setGetPersonnel(datas.find((person) => person.id === selectedOption));
    console.log(GetPersonnel);
    setValeurSelectionnee(selectedOption);
  };

  /*********************** Valeur du Date picker range *************************/

  const [dateRange, setDateRange] = useState("");
  const [dateRange1, setDateRange1] = useState(false);
  const [selection, setSelection] = useState(false);
  const [motifValidation, setMotifValidation] = useState(false);
  const [motif, setMotif] = useState("");
  const [datedebut, setDatedebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (selectedDates) => {
    setDateRange1(false);

    let dateDebut = new Date(selectedDates[0]);
    let dateFin = new Date(selectedDates[1]);

    setDatedebut(formatDate(dateDebut));
    setDateFin(formatDate(dateFin));

    let NombreJour = dateFin - dateDebut;

    let differenceJours = NombreJour / (1000 * 60 * 60 * 24) + 1;
    differenceJours = differenceJours < 0 ? 1 : differenceJours;

    setDateRange(differenceJours);
  };

  const handleMotifChange = (motif) => {
    setMotif(motif);
    setMotifValidation(false);
  };

  const [shouldShake, setShouldShake] = useState(false);

  const handleSubmit = () => {
    valeurSelectionnee === "" ? setSelection(true) : setSelection(false);
    setShouldShake(GetPersonnel.attributes.conge - dateRange < 0);
    dateRange === "" ? setDateRange1(true) : setDateRange1(false);
    motif === "" ? setMotifValidation(true) : setMotifValidation(false);

    if (
      valeurSelectionnee !== "" &&
      GetPersonnel.attributes.conge - dateRange >= 0 &&
      dateRange1 == false &&
      motifValidation == false
    ) {
      InsertConge(GetPersonnel, motif, dateRange, datedebut, dateFin);
    }
  };

  useEffect(() => {
    // Reset the shake effect after 1 second
    const timerId = setTimeout(() => {
      setShouldShake(false);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [shouldShake]);

  return (
    <>
      <Button
        onClick={() => {
          open();
        }}
      >
        + Nouveau
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        title="Nouveau congé"
        overlayProps={{
          backgroundopacity: 0.55,
          blur: 3,
        }}
      >
        <Box component="form" maw={400} mx="auto">
          <Select
            label="Identité"
            placeholder="Selectionner un personnel"
            data={
              datas &&
              datas.map((person) => ({
                value: person.id,
                label: person.attributes.nom + " " + person.attributes.prenom,
              }))
            }
            searchable
            onChange={(e) => {
              handleSelectChange(e);
            }}
            error={selection === true}
            required
          />

          <DatePickerInput
            dropdownType="modal"
            type="range"
            valueFormat="DD MMM YYYY"
            label="Jour(s) du congé"
            allowSingleDateInRange
            placeholder="Sélectionner la date"
            mt="md"
            onChange={handleDateChange}
            error={dateRange1 === true}
          />

          <Textarea
            label="Motif du congé"
            placeholder="Motif du congé"
            mt="md"
            required
            value={motif}
            onChange={(e) => handleMotifChange(e.target.value)}
            error={motifValidation === true}
          />

          <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
            <NumberInput
              label="Jour(s) prise(s)"
              placeholder="Jour(s) prise(s)"
              mt="md"
              readOnly
              value={dateRange}
            />

            <NumberInput
              label="Jour(s) restant(s)"
              placeholder="Jour(s) restant(s)"
              mt="md"
              readOnly
              className={shouldShake ? "shake negative-difference" : ""}
              /*               value={GetPersonnel.attributes.conge}
              error={GetPersonnel.attributes.conge - dateRange < 0} */
            />
          </SimpleGrid>

          <Group justify="flex-end" mt="md">
            <Button onClick={handleSubmit} type="button">
              Enregistrer
            </Button>
          </Group>
        </Box>
      </Modal>
    </>
  );
}
