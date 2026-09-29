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
import { Person } from '../../domain/models/Person';
import { registerPersonUseCase, getPersonsUseCase } from '../../main/container';

export const RegisterPersonScreen: React.FC = () => {
  const [documentNumber, setDocumentNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPersons = async () => {
    try {
      const list = await getPersonsUseCase.execute();
      setPersons(list);
    } catch {
      // Si la base de datos está vacía o iniciando, la lista queda vacía
    }
  };

  useEffect(() => {
    loadPersons();
  }, []);

  const handleRegister = async () => {
    try {
      setLoading(true);
      await registerPersonUseCase.execute({
        documentNumber,
        firstName,
        lastName,
        phone,
      });

      Alert.alert('Éxito', '¡Persona registrada correctamente!');
      setDocumentNumber('');
      setFirstName('');
      setLastName('');
      setPhone('');
      await loadPersons();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'No se pudo registrar la persona.';
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
        <Text style={styles.title}>Registro de Personas</Text>
        <Text style={styles.subtitle}>Persistencia local con SQLite y validación de documento</Text>

        {/* Formulario */}
        <View style={styles.card}>
          <Text style={styles.label}>Número de Documento / Cédula</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 1075234567"
            placeholderTextColor="#64748b"
            value={documentNumber}
            onChangeText={setDocumentNumber}
            keyboardType="numeric"
            accessibilityLabel="Número de Documento"
          />

          <Text style={styles.label}>Nombres</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Juan Carlos"
            placeholderTextColor="#64748b"
            value={firstName}
            onChangeText={setFirstName}
            accessibilityLabel="Nombres"
          />

          <Text style={styles.label}>Apellidos</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Ortiz Medina"
            placeholderTextColor="#64748b"
            value={lastName}
            onChangeText={setLastName}
            accessibilityLabel="Apellidos"
          />

          <Text style={styles.label}>Teléfono / Celular (Opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 3151234567"
            placeholderTextColor="#64748b"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            accessibilityLabel="Teléfono"
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Registrar Persona"
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Registrar Persona</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Evidencia de persistencia en SQLite */}
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>Personas en SQLite ({persons.length})</Text>
          {persons.length === 0 ? (
            <Text style={styles.emptyText}>No hay personas registradas aún.</Text>
          ) : (
            persons.map((item, index) => (
              <View key={item.id ?? index} style={styles.itemCard}>
                <Text style={styles.itemName}>
                  👤 {item.firstName} {item.lastName}
                </Text>
                <Text style={styles.itemDetail}>🪪 Documento: {item.documentNumber}</Text>
                {item.phone ? (
                  <Text style={styles.itemDetail}>📞 Teléfono: {item.phone}</Text>
                ) : null}
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
    backgroundColor: '#d97706',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#b45309',
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
    borderLeftColor: '#f59e0b',
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
});
