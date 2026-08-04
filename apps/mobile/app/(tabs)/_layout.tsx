import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useMe } from "@connosr/api-client";

export default function TabsLayout() {
  const me = useMe();

  if (me.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (me.isError || !me.data) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs screenOptions={{ headerTitle: "ConnoSr" }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="activity" options={{ title: "Atividade" }} />
      <Tabs.Screen name="journal" options={{ title: "Journal" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
    </Tabs>
  );
}
