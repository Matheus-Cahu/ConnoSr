import { useState } from "react";
import { router } from "expo-router";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useHealthCheck, useLogin } from "@connosr/api-client";

export default function LoginScreen() {
  const health = useHealthCheck();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {
    login.mutate(
      { email, password },
      { onSuccess: () => router.replace("/") },
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ConnoSr</Text>
      <Text style={{ color: health.isSuccess ? "green" : health.isError ? "crimson" : "gray" }}>
        API: {health.isLoading ? "verificando..." : health.isSuccess ? "online" : "offline"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={login.isPending ? "Entrando..." : "Entrar"} onPress={handleSubmit} disabled={login.isPending} />
      {login.isError && <Text style={{ color: "crimson" }}>Email ou senha inválidos.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
  },
});
