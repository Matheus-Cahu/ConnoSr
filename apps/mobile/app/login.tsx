import { useState } from "react";
import { Link, router, Stack } from "expo-router";
import { Pressable, Text, TextInput } from "react-native";
import { useLogin } from "@connosr/api-client";
import { colors } from "@connosr/ui";
import { AuthScreen, authErrorStyle, authInputStyle, authSubmitStyle } from "../src/components/AuthScreen";

export default function LoginScreen() {
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {
    login.mutate({ email, password }, { onSuccess: () => router.replace("/") });
  }

  return (
    <AuthScreen
      title="Bem-vindo de volta"
      subtitle="Entre para ver as experiências de quem você segue."
      footer={
        <Text style={{ color: colors.textMuted }}>
          Ainda não tem conta?{" "}
          <Link href="/signup" style={{ color: colors.primary }}>
            Cadastre-se
          </Link>
        </Text>
      }
    >
      <Stack.Screen options={{ headerShown: false }} />
      <TextInput
        placeholder="Email"
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={authInputStyle}
      />
      <TextInput
        placeholder="Senha"
        placeholderTextColor={colors.textMuted}
        autoComplete="current-password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={authInputStyle}
      />
      {login.isError ? <Text style={authErrorStyle}>Email ou senha inválidos.</Text> : null}
      <Pressable onPress={handleSubmit} disabled={login.isPending} style={authSubmitStyle}>
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
          {login.isPending ? "Entrando..." : "Entrar"}
        </Text>
      </Pressable>
    </AuthScreen>
  );
}
