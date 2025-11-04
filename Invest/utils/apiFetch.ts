import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const apiFetch = async (input: RequestInfo, init?: RequestInit) => {
    const token = await AsyncStorage.getItem("token");

    const headers: Record<string, string> = {
      ...(init?.headers as Record<string, string> || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(input, { ...init, headers });

    if (response.status === 401) {
      await AsyncStorage.removeItem("token");
      router.replace("/login");
      return null;
    }

    return response; 

};
