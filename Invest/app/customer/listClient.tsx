import API_BASE_URL from '@/constants/apiConfig';
import { apiFetch } from '@/utils/apiFetch';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

type Client = {
  id: number;
  first_name: string;
  last_name: string;
  adresse: string;
  contact: string;
  product_id: number;
  created_at: string;
};


const ClientsListScreen = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [productName, setProductName] = useState('');
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const product_id = useMemo(() => {
    if (params && typeof params.product_id === 'string') return params.product_id;
    // if (params && typeof params.product_id === 'object' && params.product_id != null) return params.product_id.toString();
    return '';
  }, [params]);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (product_id) {
      fetchClients();
      fetchProductInfo();
    }
  }, [product_id]);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, clients]);

  const fetchClients = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await apiFetch(`${API_BASE_URL}/api/clients/list?product_id=${product_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response?.json();
      if (data.status) {
        setClients(data.clients || []);
        setFilteredClients(data.clients || []);
      } else {
        Alert.alert('Erreur', data.message || 'Impossible de charger les clients');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
      Alert.alert('Erreur', 'Impossible de contacter le serveur');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchProductInfo = async () => {
    try {
      const response = await apiFetch(`${API_BASE_URL}/api/products/${product_id}`);
      if(!response) return;
      const data = await response.json();
      if (data.status) {
        setProductName(data.product?.product_name || 'Produit');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredClients(clients);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = clients.filter(client => 
      client.first_name.toLowerCase().includes(lowerQuery) ||
      client.last_name.toLowerCase().includes(lowerQuery) ||
      client.contact.toLowerCase().includes(lowerQuery) ||
      client.adresse.toLowerCase().includes(lowerQuery)
    );
    setFilteredClients(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchClients();
  };

  // const handleViewDetails = (client: Client) => {
  //   router.push({
  //     pathname: '/clients/details',
  //     params: { 
  //       clientId: client.id.toString(),
  //       clientData: JSON.stringify(client)
  //     }
  //   });
  // };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const ClientCard = ({ client, index }: { client: Client; index: number }) => {
    const cardAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View style={[styles.clientCard, { opacity: cardAnim }]}>
        <View style={styles.clientHeader}>
          <View style={styles.clientAvatar}>
            <Text style={styles.clientAvatarText}>
              {client.first_name.charAt(0)}{client.last_name.charAt(0)}
            </Text>
          </View>
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>
              {client.last_name} 
            </Text>
            <Text style={styles.clientDate}>
              {/* Ajouté le {formatDate(client.created_at)} */}
              {client.first_name}
            </Text>
          </View>
        </View>

        <View style={styles.clientDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="call-outline" size={16} color="#007AFF" />
            </View>
            <Text style={styles.detailText}>{client.contact}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="mail-outline" size={16} color="#007AFF" />
            </View>
            <Text style={styles.detailText} numberOfLines={2}>
              {client.adresse}
            </Text>
          </View>
        </View>

        {/* <TouchableOpacity 
          style={styles.viewDetailsButton}
          onPress={() => handleViewDetails(client)}
        >
          <Text style={styles.viewDetailsButtonText}>Voir plus</Text>
          <Ionicons name="chevron-forward" size={18} color="#007AFF" />
        </TouchableOpacity> */}
      </Animated.View>
    );
  };

  const EmptyState = () => (
    <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="people-outline" size={60} color="#C7C7CC" />
      </View>
      <Text style={styles.emptyTitle}>Aucun client trouvé</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery ? 
          'Aucun client ne correspond à votre recherche' : 
          'Aucun client n\'est associé à ce produit'
        }
      </Text>
    </Animated.View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Chargement des clients...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerGradient} />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <View style={styles.backButtonContainer}>
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Liste des Clients</Text>
            <Text style={styles.headerSubtitle}>{productName}</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      {/* Search Bar */}
      <Animated.View style={[styles.searchContainer, { opacity: fadeAnim }]}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un client..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </TouchableOpacity>
          ) : null}
        </View>
      </Animated.View>

      {/* Stats */}
      <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{filteredClients.length}</Text>
          <Text style={styles.statLabel}>
            Client{filteredClients.length > 1 ? 's' : ''} trouvé{filteredClients.length > 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{clients.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </Animated.View>

      {/* Liste des clients */}
      <Animated.View style={[styles.listContainer, { transform: [{ translateY: slideAnim }] }]}>
        <FlatList
          data={filteredClients}
          // keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => <ClientCard client={item} index={index} />}
          ListEmptyComponent={<EmptyState />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  headerContainer: {
    position: 'relative',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: '#007AFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    zIndex: 1,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    marginLeft: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 5,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  clientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  clientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  clientAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  clientDate: {
    fontSize: 15,
    fontWeight: '400',
    color: '#1A1A1A',
  },
  clientDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    width: 24,
    alignItems: 'center',
    marginRight: 10,
  },
  detailText: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  viewDetailsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 40,
  },
});

export default ClientsListScreen;