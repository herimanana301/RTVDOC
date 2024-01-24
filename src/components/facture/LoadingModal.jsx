import { Button, Checkbox, Modal, Stack } from "@mantine/core";
import React, { useState, useEffect } from 'react';
import { useDisclosure } from "@mantine/hooks";

const LoadingModal = ({ onSubmit, onTVAChange, onRemiseChange }) => {
    const [isTVAChecked, setTVAChecked] = useState(false);
    const [isRemiseChecked, setRemiseChecked] = useState(false);

    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        open(); 
    }, []); 

    return (
        <Modal
            opened={opened}
            onClose={close}
            centered
            title="Informations sur le TVA 20% et la Remise 10%"
            overlayProps={{
                backgroundopacity: 0.55,
                blur: 3,
            }}
            withCloseButton={false}
            closeOnClickOutside={false}
        >
            <Stack>
                <Checkbox
                    checked={isRemiseChecked}
                    onChange={(event) => {
                        setRemiseChecked(event.target.checked);
                        onRemiseChange(event.target.checked);
                    }}
                    label="Remise 10%"
                />
                <Checkbox
                    checked={isTVAChecked}
                    onChange={(event) => {
                        setTVAChecked(event.target.checked);
                        onTVAChange(event.target.checked);
                    }}
                    label="TVA 20%"
                />
                <Button 
                onClick={() => {
                    onSubmit();
                    close(); 
                }} >Confirmer</Button>
            </Stack>
            <br />
        </Modal>
    );
};

export default LoadingModal;
