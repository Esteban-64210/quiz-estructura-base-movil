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
import { Product } from '../../domain/models/Product';
import { registerProductUseCase, getProductsUseCase } from '../../main/container';

export const RegisterProductScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    try {
      const list = await getProductsUseCase.execute();
      setProducts(list);
    } catch {
      // Si la base de datos está vacía o iniciando, la lista queda vacía
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleRegister = async () => {
    const parsedPrice = parseFloat(price.trim());
    const parsedStock = parseInt(stock.trim(), 10);

    try {
      setLoading(true);
      await registerProductUseCase.execute({
        name,
        price: parsedPrice,
        stock: parsedStock,
        description,
      });

      Alert.alert('Éxito', '¡Producto registrado correctamente!');
      setName('');
      setPrice('');
      setStock('');
      setDescription('');
      await loadProducts();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'No se pudo registrar el producto.';
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
        <Text style={styles.title}>Registro de Productos</Text>
        <Text style={styles.subtitle}>Persistencia local con SQLite y validación de tipos</Text>

        {/* Formulario */}
        <View style={styles.card}>
          <Text style={styles.label}>Nombre del producto</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Teclado Mecánico RGB"
            placeholderTextColor="#64748b"
            value={name}
            onChangeText={setName}
            accessibilityLabel="Nombre del producto"
          />

          <View style={styles.row}>
            <View style={styles.flexHalf}>
              <Text style={styles.label}>Precio ($)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 150000"
                placeholderTextColor="#64748b"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                accessibilityLabel="Precio"
              />
            </View>
            <View style={styles.spacer} />
            <View style={styles.flexHalf}>
              <Text style={styles.label}>Cantidad / Stock</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 25"
                placeholderTextColor="#64748b"
                value={stock}
                onChangeText={setStock}
                keyboardType="number-pad"
                accessibilityLabel="Stock"
              />
            </View>
          </View>

          <Text style={styles.label}>Descripción (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ej: Switch azul, conexión inalámbrica y cable"
            placeholderTextColor="#64748b"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            accessibilityLabel="Descripción"
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Registrar Producto"
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Registrar Producto</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Evidencia de persistencia en SQLite */}
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>Productos en SQLite ({products.length})</Text>
          {products.length === 0 ? (
            <Text style={styles.emptyText}>No hay productos registrados aún.</Text>
          ) : (
            products.map((item, index) => (
              <View key={item.id ?? index} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>📦 {item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price.toLocaleString()}</Text>
                </View>
                <Text style={styles.itemDetail}>Stock disponible: {item.stock} unidades</Text>
                {item.description ? (
                  <Text style={styles.itemDesc}>{item.description}</Text>
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
  row: {
    flexDirection: 'row',
  },
  flexHalf: {
    flex: 1,
  },
  spacer: {
    width: 12,
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
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#047857',
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
    borderLeftColor: '#10b981',
    borderWidth: 1,
    borderColor: '#334155',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#f8fafc',
    flex: 1,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#34d399',
  },
  itemDetail: {
    fontSize: 13,
    color: '#cbd5e1',
    marginTop: 4,
  },
  itemDesc: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
