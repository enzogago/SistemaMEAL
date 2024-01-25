import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../../img/PowerMas_LogoAyudaEnAccion.png';

// Crea estilos
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#E4E4E4',
    padding: 30
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
    color: '#3f51b5'  // Cambia esto al color que prefieras
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
    width: "auto",
    height: 40
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: { 
    margin: "auto", 
    flexDirection: "row" 
  },
  tableCol: { 
    width: "25%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  },
  tableCell: { 
    margin: "auto", 
    marginTop: 5, 
    fontSize: 10 
  }
});

// Crea el documento
const TableToPDF = ({ data }) => (
  <Document>
    <Page size="A4 landscape" style={styles.page}>
        <Image style={styles.image} src={logo} />
        <Text style={styles.title}>Listado de estados</Text>
        <View style={styles.table}>
            {data.map((item, index) => (
            <View key={index} style={styles.tableRow}>
                <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.estCod}</Text>
                </View>
                <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.estNom}</Text>
                </View>
            </View>
            ))}
        </View>
    </Page>
  </Document>
);

export default TableToPDF;
