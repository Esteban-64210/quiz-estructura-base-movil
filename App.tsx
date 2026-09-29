import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { RegisterPersonScreen } from './src/presentation/persons/RegisterPersonScreen';
import { RegisterProductScreen } from './src/presentation/products/RegisterProductScreen';
import { RegisterUserScreen } from './src/presentation/users/RegisterUserScreen';
import { DatabaseConnection } from './src/infrastructure/database/DatabaseConnection';

type ActiveTab = 'persons' | 'products' | 'users';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('persons');

  useEffect(() => {
    // Inicializar SQLite al arrancar la aplicación
    DatabaseConnection.init().catch((err) => {
      console.warn('Error al iniciar base de datos SQLite:', err);
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Encabezado Principal */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CORHUILA Móvil</Text>
        <Text style={styles.headerSubtitle}>Estructura Base SQLite · Quiz</Text>
      </View>

      {/* Barra de Pestañas / Navegación */}
      <View style={styles.tabBar} accessibilityRole="tablist">
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'persons' && styles.tabItemActive]}
          onPress={() => setActiveTab('persons')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'persons' }}
          accessibilityLabel="Pestaña Personas"
        >
          <Text style={[styles.tabText, activeTab === 'persons' && styles.tabTextActive]}>
            👤 Personas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'products' && styles.tabItemActive]}
          onPress={() => setActiveTab('products')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'products' }}
          accessibilityLabel="Pestaña Productos"
        >
          <Text style={[styles.tabText, activeTab === 'products' && styles.tabTextActive]}>
            📦 Productos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'users' && styles.tabItemActive]}
          onPress={() => setActiveTab('users')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'users' }}
          accessibilityLabel="Pestaña Usuarios"
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.tabTextActive]}>
            👥 Usuarios
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido de la Pantalla Activa */}
      <View style={styles.screenContainer}>
        {activeTab === 'persons' && <RegisterPersonScreen />}
        {activeTab === 'products' && <RegisterProductScreen />}
        {activeTab === 'users' && <RegisterUserScreen />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    backgroundColor: '#0f172a',
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#38bdf8',
    backgroundColor: '#0f172a',
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#38bdf8',
    fontWeight: 'bold',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});
