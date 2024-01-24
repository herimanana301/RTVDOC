import React, { useState, useEffect } from "react";
import { SimpleGrid, Paper, Text, ScrollArea } from "@mantine/core";
import dayjs from "dayjs";
import { Calendar } from "@mantine/dates";
import axios from "axios";
import urls from "../../../services/urls";

const Bookingdisplay = () => {
  const [selected, setSelected] = useState([]);
  const [programmedList, setProgrammedList] = useState([]);

  const handleSelect = (date) => {
    const isSelected = selected.some((s) => dayjs(date).isSame(s, "date"));
    if (isSelected) {
      setSelected((current) =>
        current.filter((d) => !dayjs(d).isSame(date, "date"))
      );
    } else if (selected.length < 3) {
      setSelected((current) => [...current, date]);
    }
  };

  const programmationData = () => {
    axios
      .get(`${urls.StrapiUrl}api/programmations?_limit=-1`)
      .then((response) => {
        const programmationList = response.data.data;
        setProgrammedList(programmationList);
      });
  };

  useEffect(() => {
    programmationData();
  }, []);

  const filteredProgramme = programmedList
    .filter((programm) =>
      selected.some((date) =>
        dayjs(date).isSame(programm.attributes.datediffusion, "date")
      )
    )
    .sort((a, b) =>
      dayjs(a.attributes.datediffusion).diff(dayjs(b.attributes.datediffusion))
    );

  return (
    <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
      <SimpleGrid cols={1} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "3rem",
          }}
        >
          <Calendar
            getDayProps={(date) => ({
              selected: selected.some((s) => dayjs(date).isSame(s, "date")),
              disabled: dayjs(date).isBefore(dayjs(), "date"),
              onClick: () => handleSelect(date),
            })}
            defaultValue={[dayjs()]} // Set today as one of the default selected values
          />
        </div>
      </SimpleGrid>
      <SimpleGrid cols={1} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
        <ScrollArea h={700}>
          {filteredProgramme.map((programm) => (
            <Paper
              shadow="xl"
              p="xl"
              m="xl"
              key={programm.id}
              bg={
                dayjs(programm.attributes.datediffusion).isBefore(dayjs())
                  ? "orange"
                  : "white"
              }
            >
              <Text>
                Heure de diffusion:{" "}
                {new Intl.DateTimeFormat("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(programm.attributes.datediffusion))}
              </Text>
              <Text>Titre du fichier: {programm.attributes.nomfichier}</Text>
            </Paper>
          ))}
        </ScrollArea>
      </SimpleGrid>
    </SimpleGrid>
  );
};

export default Bookingdisplay;
