import React from 'react';
import { Modal, Select, SimpleGrid, Button, Text, Group, ActionIcon, NumberInput, TextInput, Menu } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import checked from "../../assets/icons/checked.gif";
import { useDisclosure } from "@mantine/hooks";
import { IconBolt } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { FactureconfirmationModal } from '../../services/alertConfirmation';
import { Link } from "react-router-dom";
import { ArchiverCommandeConfirm, DesarchiverCommandeConfirm} from "../../services/alertConfirmation";
import { ArchiverCommande, DesarchiverCommande } from "./hanldeFacture";

import {
    IconPencil,
    IconMessages,
    IconNote,
    IconReportAnalytics,
    IconTrash,
    IconDots,
} from '@tabler/icons-react';

export default function FactureModal(props) {
    const { id, archive } = props.datas;
    const [opened, { open, close }] = useDisclosure(false);

    const formatDate = (date) => {

        const date1 = new Date(date);

        const year = date1.getFullYear();
        const month = (date1.getMonth() + 1).toString().padStart(2, "0");
        const day = date1.getDate().toString().padStart(2, "0");

        return `${day}-${month}-${year}`;
    };


    const [FormData, setFormData] = useState({
        datePayement: new Date(),
        payement: '',
        montantTotal: '',
        typePayement: 'Complet'
    });

    const [Status, setStatus] = useState(false);


    const submitButton = async () => {



    }
    return (
        <>

            <Menu
                transitionProps={{ transition: 'pop' }}
                withArrow
                position="bottom-end"
                withinPortal
            >
                <Menu.Target>
                    <ActionIcon variant="subtle" color="gray" >
                        <IconDots />
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item> <Link style={{ textDecoration: 'none' }} to={{ pathname: `/facture/${id}`, }}>Facturation</Link></Menu.Item>
                    <Menu.Item onClick={() => open()}>Paiement</Menu.Item>
                    {archive ? (
                        <Menu.Item onClick={() => DesarchiverCommandeConfirm(id, DesarchiverCommande)} color="yellow">
                            Desarchiver
                        </Menu.Item>
                    ) : (
                        <Menu.Item onClick={() => ArchiverCommandeConfirm(id, ArchiverCommande)} color="yellow">
                            Archiver
                        </Menu.Item>
                    )}
                </Menu.Dropdown>
            </Menu>

            <Modal
                opened={opened}
                onClose={close}
                centered
                title="Information sur le paiement"
                overlayProps={{
                    backgroundopacity: 0.55,
                    blur: 3,
                }}
            >
                <form onSubmit={(event) => event.preventDefault()}>

                    <DatePickerInput
                        dropdownType="modal"
                        valueFormat="DD MMM YYYY"
                        label="Date de paiement"
                        placeholder="Sélectionnez une date"
                        onChange={(e) =>
                            setFormData((prevData) => {
                                const newData = { ...prevData, datePayement: e };
                                return newData;
                            })
                        }
                        defaultValue={new Date(FormData.datePayement)}
                    />
                    <br />
                    <TextInput
                        label="Réfence du payement"
                        placeholder="Preuve du payement"
                        required
                    />
                    <SimpleGrid cols={1} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                        <Select
                            label="Payement"
                            data={['Avance', 'Complet']}
                            defaultValue="Complet"
                            onChange={(e) =>
                                setFormData((prevData) => {
                                    const newData = { ...prevData, typePayement: e };
                                    return newData;
                                })}
                        />
                    </SimpleGrid>

                    <NumberInput
                        hideControls
                        label="Montant total"
                        placeholder="Montant en Ariary"
                        mt="md"
                        required
                    />

                    <Group style={{ display: "flex", justifyContent: "space-between" }} mt="md">
                        <Button onClick={submitButton} type="submit">Sauvegarder</Button>
                    </Group>

                </form>
            </Modal>
        </>
    );

}
