import {
  Button,
  Grid,
  Skeleton,
  Container,
  Menu,
  Paper,
  Select,
  Title,
  Text,
  Flex,
  NativeSelect,
} from "@mantine/core";
import { useEffect, useState } from "react";
import urls from "../../services/urls";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { IconFilter } from "@tabler/icons-react";

export default function General() {
  const [dataNumber, setDataNumber] = useState({
    clientNumber: 0,
    orderNumber: 0,
    personelNumber: 0,
  });
  // Données de paiement
  const [paymentData, setPaymentData] = useState([]);
  const [commandeData, setCommandeData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(
    String(new Date().getFullYear())
  );
  //Menu
  const [menuVisible, setMenuVisible] = useState(false);
  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };

  useEffect(() => {
    axios.get(`${urls.StrapiUrl}api/clients?_limit=-1`).then((response) => {
      setDataNumber((prevData) => {
        return { ...prevData, clientNumber: response.data.data.length };
      });
    });
    axios.get(`${urls.StrapiUrl}api/commandes?_limit=-1`).then((response) => {
      setDataNumber((prevData) => {
        return { ...prevData, orderNumber: response.data.data.length };
      });
    });
    axios.get(`${urls.StrapiUrl}api/personnels?_limit=-1`).then((response) => {
      setDataNumber((prevData) => {
        return { ...prevData, personelNumber: response.data.data.length };
      });
    });
    axios
      .get(`${urls.StrapiUrl}api/payements?populate=commande.client`)
      .then((response) => {
        setPaymentData(response.data.data);
      });
  }, []);

  const filteredData = paymentData.map((payment) => ({
    nomclient:
      payment.attributes.commande.data.attributes.client.data.attributes
        .raisonsocial,
    montantTotal: payment.attributes.montantTotal,
    datePayement: payment.attributes.datePayement,
  }));
  const clientDataperMonth = () => {
    if (filteredData) {
      let clientList = [];
      filteredData.forEach((data) => {
        if (!clientList.includes(data.nomclient)) {
          clientList.push(data.nomclient);
        }
      }); // clientList est la liste des noms de clients

      let monthlyTotal = Array.from({ length: 12 }).fill(0);
      clientList.forEach((client) => {
        const totalInvoice = (month) => {
          if (
            filteredData.filter(
              (data) =>
                data.nomclient === client &&
                new Date(data.datePayement).getMonth() === month
            ).length > 1
          ) {
            return filteredData
              .filter(
                (data) =>
                  data.nomclient === client &&
                  new Date(data.datePayement).getMonth() === month
              )
              .reduce(
                (sum, current) => sum.montantTotal + current.montantTotal
              );
          } else {
            return filteredData.filter(
              (data) =>
                data.nomclient === client &&
                new Date(data.datePayement).getMonth() === month
            )[0].montantTotal;
          }
        }; // cette partie calcul tout en totalité sans considérer le mois

        const invoiceMonths = filteredData
          .filter((data) => data.nomclient === client)
          .map((months) => new Date(months.datePayement).getMonth())
          .sort((a, b) => a - b);

        invoiceMonths.forEach((month) => {
          if (monthlyTotal[month] === 0) {
            monthlyTotal[month] = [
              {
                client: client,
                monthtotal: totalInvoice(month),
              },
            ];
          } else {
            monthlyTotal[month] = [
              ...monthlyTotal[month],
              {
                client: client,
                monthtotal: totalInvoice(month),
              },
            ];
          }
        });
      });
      return monthlyTotal;
    }
  };

  // Function to calculate sum of 'montantTotal' for each month
  const calculateMonthlyTotal = () => {
    const monthlyTotal = Array.from({ length: 12 }).fill(0); // Initialize array to hold monthly totals

    // Iterate through payment data and sum 'montantTotal' for each month
    paymentData.forEach((payment) => {
      const month = new Date(payment.attributes.datePayement).getMonth(); // Get month index (0 - 11)
      monthlyTotal[month] += payment.attributes.montantTotal; // Add 'montantTotal' to corresponding month
    });

    return monthlyTotal;
  };
  //////////////////////////////////////////////////////////

  // Function to calculate montantTotal for each nomclient depending on every month
  const calculateMonthlyTotalForClients = () => {
    const monthlyTotalForClients = {}; // Initialize an object to hold monthly totals for each nomclient

    // Initialize monthly totals for all clients for each month
    for (const payment of filteredData) {
      const month = new Date(payment.datePayement).getMonth(); // Get month index (0 - 11)
      const nomclient = payment.nomclient;

      if (!monthlyTotalForClients[nomclient]) {
        monthlyTotalForClients[nomclient] = Array.from({ length: 12 }).fill(0);
      }
    }

    // Iterate through filteredData to compute montantTotal for each nomclient
    filteredData.forEach((payment) => {
      const month = new Date(payment.datePayement).getMonth(); // Get month index (0 - 11)
      const nomclient = payment.nomclient;

      // Add montantTotal to corresponding month for nomclient
      monthlyTotalForClients[nomclient][month] += payment.montantTotal;
    });

    return monthlyTotalForClients;
  };

  // Function to fetch data based on the selected year and update chart data
  const fetchData = (year) => {
    // Fetch payment data based on the selected year
    axios
      .get(`${urls.StrapiUrl}api/payements?_limit=-1&datePayment_like=${year}`)
      .then((response) => {
        setPaymentData(response.data.data);
      });

    // Fetch commande data based on the selected year
    axios
      .get(
        `${urls.StrapiUrl}api/payements?populate=commande.client&datePayment_like=${year}`
      )
      .then((response) => {
        setCommandeData(response.data.data);
      });
  };
  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  useEffect(() => {
    fetchData(selectedYear);
    console.log(selectedYear);
    console.log(calculateMonthlyTotal());
  }, [selectedYear]);

  //Générer une liste d'année
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = 2023; i <= currentYear; i++) {
    years.push({ value: String(i), label: String(i) });
  }

  //////////////////////////

  // Data for the line chart
  const chartData = Array.from({ length: 12 }).map((_, index) => {
    const monthName = new Date(0, index).toLocaleString("default", {
      month: "long",
    }); // Convert month index to month name
    const monthlyTotal = calculateMonthlyTotal()[index]; // Get sum of 'montantTotal' for corresponding month
    const clientMonthlyTotal = calculateMonthlyTotalForClients();

    // Construct data for each client
    const clientData = Object.keys(clientMonthlyTotal).map((client) => ({
      nomclient: client,
      montantTotal: clientMonthlyTotal[client][index],
    }));

    return {
      month: monthName,
      montantTotal: monthlyTotal,
      client: clientData,
    };
  });

  return (
    <Container my="md">
      <Grid>
        <Grid.Col xs={4}>
          <Paper
            shadow="xs"
            radius="xl"
            p="xl"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: "4rem" }}>{dataNumber.clientNumber}</Text>
            <Text>Nombre de client</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col xs={8}>
          {" "}
          <Paper
            shadow="xs"
            radius="xl"
            p="xl"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: "4rem" }}>{dataNumber.orderNumber}</Text>
            <Text>Nombre de commande</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col xs={5}>
          <Paper
            shadow="xs"
            radius="xl"
            p="xl"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: "4rem" }}>
              {dataNumber.personelNumber}
            </Text>
            <Text>Nombre de personnel</Text>
          </Paper>
        </Grid.Col>

        <Grid.Col xs={14}>
          <Paper
            shadow="xs"
            radius="xl"
            p="xl"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ margin: "1em auto" }}>
              Sélectionner une année pour filtrer les données
            </Text>
            <Select
              data={years}
              value={selectedYear}
              onChange={(event) => handleYearChange(event)}
            />
            <Title order={1} style={{ marginTop: "2em" }} id="TitreChart">
              Vue d'ensemble des chiffres d'affaires
            </Title>
            <LineChart
              width={800}
              height={400}
              data={chartData}
              style={{ margin: "2em auto" }}
            >
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />

              {/* Render the total montantTotal line */}
              <Line type="monotone" dataKey="montantTotal" stroke="#8884d8" />

              {/* Map through each client and render a Line for it */}
              {chartData[0].client.map((client, index) => (
                <Line
                  key={client.nomclient}
                  type="monotone"
                  dataKey={`client[${index}].montantTotal`}
                  name={client.nomclient}
                  stroke={`#${Math.floor(Math.random() * 16777215).toString(
                    16
                  )}`}
                />
              ))}
            </LineChart>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
