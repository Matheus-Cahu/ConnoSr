import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { Feather } from "@expo/vector-icons";
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
    <Tabs
      screenOptions={{
        headerTitle: "ConnoSr",
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#e8503a",
        tabBarInactiveTintColor: "#7a7a82",
        tabBarStyle: { backgroundColor: "#0f0f12", borderTopColor: "#2a2a30" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} />,
          headerStyle: { backgroundColor: "#050506" },
          headerTintColor: "#f5f5f0",
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: "Journal",
          tabBarIcon: ({ color, size }) => <Feather name="file-text" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Criar post",
          tabBarIcon: ({ color, size }) => <Feather name="plus" color={color} size={size} />,
          headerStyle: { backgroundColor: "#050506" },
          headerTintColor: "#f5f5f0",
        }}
      />
      <Tabs.Screen
        name="my-activity"
        options={{
          title: "Minha atividade",
          tabBarIcon: ({ color, size }) => <Feather name="activity" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Perfil", tabBarIcon: ({ color, size }) => <Feather name="user" color={color} size={size} /> }}
      />
    </Tabs>
  );
}
