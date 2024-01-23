import React from 'react';
import { Modal, FileInput, SimpleGrid, Switch, Button, Text, Group, ActionIcon,NumberInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import checked from "../../assets/icons/checked.gif";
import { useDisclosure } from "@mantine/hooks";
import { IconBolt } from "@tabler/icons-react";

export default function FactureModal({ datas }) {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Group spacing={0} position="right">
                <ActionIcon onClick={() => open()}>
                    <IconBolt size="1rem" stroke={1.5} />
                </ActionIcon>
            </Group>
            <Modal
                opened={opened}
                onClose={close}
                centered
                title="Information facture"
                overlayProps={{
                    backgroundopacity: 0.55,
                    blur: 3,
                }}
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

                <NumberInput
                    label="Montant total"
                    placeholder="Montant en Ariary"
                    mt="md"
                />
                <SimpleGrid cols={1} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                    <Switch mt="md" label="Payé" /><br />
                </SimpleGrid>

                <Button
                    style={{ marginTop: 15 }}
                    component="a"
                    href={`/facture/${datas}`}
                >
                    Imprimer une facture
                </Button>

            </Modal>
        </>
    );

};
