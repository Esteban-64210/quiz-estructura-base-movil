import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { User } from '../../domain/models/User';
import { registerUserUseCase, getUsersUseCase } from '../../main/container';

export const RegisterUserScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      const list = await getUsersUseCase.execute();
      setUsers(list);
    } catch {
      // Si la base de datos está vacía o iniciando, la lista queda vacía
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRegister = async () => {
    try {
      setLoading(true);
      await registerUserUseCase.execute({
        username,
        email,
        password,
      });

      Alert.alert('Éxito', '¡Usuario registrado correctamente!');
      setUsername('');
      setEmail('');
      setPassword('');
      await loadUsers();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'No se pudo registrar el usuario.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Registro de Usuarios</Text>
        <Text style={styles.subtitle}>Persistencia segura con SQLite y hash con sal</Text>

        {/* Formulario */}
        <View style={styles.card}>
          <Text style={styles.label}>Nombre de usuario</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: jortiz"
            placeholderTextColor="#64748b"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Nombre de usuario"
          />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: jortiz@corhuila.edu.co"
            placeholderTextColor="#64748b"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Correo electrónico"
          />

          <Text style={styles.label}>Contraseña (mínimo 6 caracteres)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa una contraseña segura"
            placeholderTextColor="#64748b"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            accessibilityLabel="Contraseña"
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Registrar Usuario"
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Registrar Usuario</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Evidencia de persistencia en SQLite */}
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>Usuarios en SQLite ({users.length})</Text>
          {users.length === 0 ? (
            <Text style={styles.emptyText}>No hay usuarios registrados aún.</Text>
          ) : (
            users.map((item, index) => (
              <View key={item.id ?? index} style={styles.itemCard}>
                <Text style={styles.itemName}>👤 {item.username}</Text>
                <Text style={styles.itemDetail}>✉️ {item.email}</Text>
                {item.createdAt && (
                  <Text style={styles.itemDate}>
                    📅 {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}
                  </Text>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#0f172a',
    color: '#f8fafc',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#1d4ed8',
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listSection: {
    marginTop: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 10,
  },
  emptyText: {
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
  itemCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#38bdf8',
    borderWidth: 1,
    borderColor: '#334155',
  },
  itemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  itemDetail: {
    fontSize: 13,
    color: '#cbd5e1',
    marginTop: 4,
  },
  itemDate: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 6,
  },
});
