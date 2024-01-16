// AjoutCongeModal.js
import React, { useState, useEffect} from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';
import { useForm, isNotEmpty, hasLength, matches } from '@mantine/form';
import { Group, TextInput, NumberInput, Box, Textarea, Select, SimpleGrid } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import './css/modal_nouveau.css';


export default function AjoutCongeModal(datas) {
  const [opened, { open, close }] = useDisclosure(false);


  const identite = Object.values(datas.datas).map((data) => {
    return data.attributes; // Assurez-vous que data.attributes contient les informations nécessaires
  });

  /*********************** Valeur du dropdown *************************/

  const [valeurSelectionnee, setValeurSelectionnee] = useState(null);
  const [GetPersonnel, setGetPersonnel] = useState({});

  const handleSelectChange = (selectedOption) => {
    setValeurSelectionnee(selectedOption);
    const selectedPerson = identite.find((person) => person.idPersonnel === selectedOption);
    setGetPersonnel(selectedPerson);
  };

  /*********************** Valeur du Date picker range *************************/

  const [dateRange, setDateRange] = useState('');
  const [dateRange1, setDateRange1] = useState(false);
  const [selection, setselection] = useState(false);

  const handleDateChange = (selectedDates) => {

    var dateDebut = new Date(selectedDates[0]);
    var dateFin = new Date(selectedDates[1]);

    var NombreJour = dateFin - dateDebut;

    var differenceJours = (NombreJour / (1000 * 60 * 60 * 24)) + 1 ;
    differenceJours = differenceJours < 0 ? 1 : differenceJours;

    setDateRange(differenceJours);

  };

  const [shouldShake, setShouldShake] = useState(false);

  const handleSubmit = () => {
   
    valeurSelectionnee === null ? setselection(true) : setselection(false);
    setShouldShake((GetPersonnel.conge-dateRange) < 0);
    dateRange === '' ? setDateRange1(true) : setDateRange1(false);
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
      <Button onClick={() => { open() }}>+ Nouveau</Button>
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
            data={identite.map((person) => ({
              value: person.idPersonnel,
              label: person.nom + " " + person.prenom,
            }))}
            searchable
            onChange={handleSelectChange}
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
            // value={dateRange}
          />

          <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>

            <NumberInput
              label="Jour(s) prise(s)"
              placeholder="Jour(s) prise(s)"
              mt="md"
              readOnly
              value={dateRange}
              className={shouldShake ? 'shake negative-difference' : ''}
              error={(GetPersonnel.conge-dateRange) < 0}
            />

            <NumberInput
              label="Jour(s) restant(s)"
              placeholder="Jour(s) restant(s)"
              mt="md"
              readOnly
              value={GetPersonnel.conge}
            />

          </SimpleGrid>

          <Group justify="flex-end" mt="md">
            <Button onClick={handleSubmit} type="button">Enregistrer</Button>
          </Group>
        </Box>

      </Modal>
    </>
  );
}


