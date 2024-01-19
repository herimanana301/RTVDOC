import React from 'react';
import { Modal, FileInput, SimpleGrid, Switch, Button, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import FactureContent from './FactureContent';

const FactureModal = ({ isOpen, onClose, selectedItem}) => {
    
    const print = () =>{
        FactureContent();
    }
    
    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            style={{ alignItems: 'center' }}
            title={<Text fz="sm" fw={500}>Aperçu de la facture</Text>}
            centered
        >
            <DatePickerInput
                dropdownType="modal"
                clearable
                valueFormat="DD MMM YYYY"
                label="Date de paiement"
                placeholder="Sélectionnez une date"
                
            />
            <br />
            <FileInput
                label="Preuve de paiement"
                description="Capture d'écran avec moyen de paiement"
                placeholder="Placez votre fichier ici."
                clearable
            />
            <br />
            <SimpleGrid cols={1} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                <Switch mt="md" label="Payé" /><br />
            </SimpleGrid>

            <Button
                style={{ marginTop: 15 }}
                onClick={() => print}
                disabled={selectedItem && selectedItem.status === 'Non Payé'}
            >
                Imprimer
            </Button>
        </Modal>
    );



};

export default FactureModal;
