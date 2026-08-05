import { useState } from "react";
import { Link, router, Stack } from "expo-router";
import { Pressable, Text, TextInput } from "react-native";
import { useSignup } from "@connosr/api-client";
import { colors } from "@connosr/ui";
import { AuthScreen, authErrorStyle, authInputStyle, authSubmitStyle } from "../src/components/AuthScreen";

export default function SignupScreen() {
  const signup = useSignup();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {
    signup.mutate(
      { displayName, username, email, password },
      { onSuccess: () => router.replace("/") },
    );
  }

  return (
    <AuthScreen
      title="Crie sua conta"
      subtitle="Comece a registrar e descobrir experiências."
      footer={
        <Text style={{ color: colors.textMuted }}>
          Já tem conta?{" "}
          <Link href="/login" style={{ color: colors.primary }}>
            Entrar
          </Link>
        </Text>
      }
    >
      <Stack.Screen options={{ headerShown: false }} />
      <TextInput
        placeholder="Nome de exibição"
        placeholderTextColor={colors.textMuted}
        autoComplete="name"
        value={displayName}
        onChangeText={setDisplayName}
        maxLength={80}
        style={authInputStyle}
      />
      <TextInput
        placeholder="Usuário"
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoComplete="username"
        value={username}
        onChangeText={(text) => setUsername(text.toLowerCase())}
        maxLength={30}
        style={authInputStyle}
      />
      <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: -8 }}>
        só letras minúsculas, números e underscore
      </Text>
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
        autoComplete="new-password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={authInputStyle}
      />
      {signup.isError ? (
        <Text style={authErrorStyle}>
          Não foi possível criar a conta. Verifique os dados (email/usuário já podem estar em uso).
        </Text>
      ) : null}
      <Pressable onPress={handleSubmit} disabled={signup.isPending} style={authSubmitStyle}>
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
          {signup.isPending ? "Criando conta..." : "Criar conta"}
        </Text>
      </Pressable>
    </AuthScreen>
  );
}
