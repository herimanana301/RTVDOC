import React from 'react';
import { Modal, FileInput, SimpleGrid, Switch, Button, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';

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
<<<<<<< HEAD
                onClick={() => print}
=======
                component="a"
                href="/facture"
>>>>>>> 0197e516165dcb7b411a095ebac3eb8874397979
                disabled={selectedItem && selectedItem.status === 'Non Payé'}
            >
                Aperçu avant impression
            </Button>
        </Modal>
    );



};

export default FactureModal;
