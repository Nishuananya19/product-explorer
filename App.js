
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const API_URL = 'https://fakestoreapi.com/products';

function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError('');

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Unable to fetch products.');
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5B4BDB" />
        <Text style={styles.helper}>Loading products...</Text>
      </View>
    );
  }

  if (error && products.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Pressable
          style={styles.button}
          onPress={() => fetchProducts()}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchProducts(true)}
            colors={['#5B4BDB']}
          />
        }
        ListEmptyComponent={
          <Text style={styles.helper}>No products found.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate('ProductDetails', {
                product: item,
              })
            }
          >
            <Image
              source={{ uri: item.image }}
              style={styles.thumbnail}
              resizeMode="contain"
            />

            <View style={styles.productInfo}>
              <Text style={styles.category}>
                {item.category}
              </Text>

              <Text style={styles.productTitle} numberOfLines={2}>
                {item.title}
              </Text>

              <Text style={styles.price}>
                ${Number(item.price).toFixed(2)}
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

function ProductDetailsScreen({ route }) {
  const { product } = route.params;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.details}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.detailTitle}>{product.title}</Text>
      <Text style={styles.detailPrice}>
        ${Number(product.price).toFixed(2)}
      </Text>

      <View style={styles.rating}>
        <Text style={styles.ratingText}>
          ★ {product.rating?.rate ?? 'N/A'}
        </Text>
        <Text style={styles.helper}>
          {product.rating?.count ?? 0} reviews
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>
        {product.description}
      </Text>
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#24213D',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#F7F7FB' },
        }}
      >
        <Stack.Screen
          name="Products"
          component={ProductListScreen}
          options={{
            title: 'Product Explorer',
          }}
        />

        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{
            title: 'Product Details',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FB',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F7F7FB',
  },
  helper: {
    color: '#77758A',
    marginTop: 10,
    fontSize: 14,
  },
  error: {
    color: '#C62828',
    textAlign: 'center',
    margin: 16,
  },
  button: {
    backgroundColor: '#5B4BDB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    gap: 12,
    elevation: 2,
  },
  thumbnail: {
    width: 75,
    height: 90,
    backgroundColor: '#FFFFFF',
  },
  productInfo: {
    flex: 1,
    gap: 6,
  },
  category: {
    color: '#5B4BDB',
    fontSize: 12,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#24213D',
    lineHeight: 20,
  },
  price: {
    color: '#16805D',
    fontWeight: '700',
    fontSize: 16,
  },
  arrow: {
    fontSize: 28,
    color: '#9995B5',
  },
  details: {
    padding: 22,
    paddingBottom: 40,
  },
  imageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 260,
  },
  detailTitle: {
    fontSize: 23,
    lineHeight: 31,
    fontWeight: '700',
    color: '#24213D',
    marginTop: 10,
  },
  detailPrice: {
    fontSize: 26,
    color: '#16805D',
    fontWeight: '800',
    marginTop: 14,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
  },
  ratingText: {
    color: '#A66B00',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#24213D',
    marginTop: 28,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#666477',
  },
});
