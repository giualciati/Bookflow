import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Color, Border, FontFamily } from "../styles/GlobalStyles";

export default function BookDetailsScreen({ navigation }) {
  return (
    <ScrollView style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* IMAGEM DO LIVRO */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/img/AHipotese.jpg")}
          style={styles.image}
        />
      </View>

      {/* CONTEÚDO */}
      <View style={styles.card}>
        <Text style={styles.title}>A Hipótese do Amor</Text>

        <Text style={styles.subtitle}>Arqueiro • 2022 • 336 páginas</Text>

        {/* PREÇO */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>R$ 43,81</Text>
          <Text style={styles.discount}>-10%</Text>
        </View>

        {/* DESCRIÇÃO */}
        <Text style={styles.description}>
          Quando um namoro de mentira entre cientistas encontra a irresistível
          força da atração, todas as teorias cuidadosamente calculadas sobre o
          amor são postas à prova.
        </Text>

        {/* BOTÕES */}
        <TouchableOpacity style={styles.outlineButton}>
          <Text style={styles.outlineButtonText}>Adicionar ao carrinho</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton, styles.bookButton]}
          onPress={() => navigation.navigate("MyLibrary")}
        >
          <Text style={styles.primaryButtonText}>Comprar agora</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Color.colorSteelblue,
  },

  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  imageContainer: {
    alignItems: "center",
    marginTop: 20,
  },

  image: {
    width: 180,
    height: 260,
    borderRadius: 10,
  },

  card: {
    backgroundColor: "#fff",
    marginTop: 30,
    borderTopLeftRadius: Border.br_30,
    borderTopRightRadius: Border.br_30,
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontFamily: FontFamily.poppinsBold,
    color: Color.colorSteelblue,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },

  priceContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    gap: 10,
  },

  price: {
    fontSize: 24,
    fontFamily: FontFamily.poppinsBold,
  },

  discount: {
    color: "red",
    fontSize: 14,
  },

  description: {
    marginTop: 20,
    fontSize: 14,
    color: "#444",
    textAlign: "center",
  },

  outlineButton: {
    marginTop: 25,
    borderWidth: 2,
    borderColor: Color.colorSteelblue,
    borderRadius: 50,
    padding: 15,
    alignItems: "center",
  },

  outlineButtonText: {
    color: Color.colorSteelblue,
    fontFamily: FontFamily.poppinsSemiBold,
  },

  primaryButton: {
    marginTop: 10,
    backgroundColor: Color.colorSteelblue,
    borderRadius: 50,
    padding: 15,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#fff",
    fontFamily: FontFamily.poppinsSemiBold,
  },
});
