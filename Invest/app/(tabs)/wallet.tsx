import {
  Animated,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Download, Upload, CreditCard } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useNavigation } from 'expo-router';
import BottomModal from '@/components/ui/BottomModal';
import { DepositForm } from '@/components/wallet/transactionType/DepositForm';
import { WithdrawForm } from '@/components/wallet/transactionType/WithdrawForm';
import API_BASE_URL from '@/constants/apiConfig';
import { apiFetch } from '@/utils/apiFetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { SafeAreaView } from 'react-native-safe-area-context';
import Solde from '@/components/item/Solde';

interface Transaction {
  id: number;
  type: string;
  amount: number;
  status: string;
  reference: string;
  date: string;
  hour: string;
}

export default function Wallet() {
  const router = useRouter();
  const navigation = useNavigation();

  const [wallet, setWallet] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [loading, setLoading] = useState(true);

  const tabBarOpacity = useRef(new Animated.Value(1)).current;
  const [shouldDisplayTabBar, setShouldDisplayTabBar] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [filter, setFilter] = useState('all');

  const [activeSlide, setActiveSlide] = useState(0);

  const filteredTransactions = transactions
    .filter((t) => {
      if (filter === 'validated') return t.status === 'validé';
      if (filter === 'rejected') return t.status === 'rejeté';
      if (filter === 'pending') return t.status === 'en attente';
      return true;
    });

  const totalPages = Math.ceil(filteredTransactions.length / perPage);
  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * perPage,
    page * perPage
  );


  const tabBarHeight = 72;
  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: shouldDisplayTabBar
        ? {
            position: 'absolute',
            bottom: 0,
            left: 16,
            right: 16,
            height: tabBarHeight,
            backgroundColor: 'white',
            elevation: 0,
            justifyContent: 'space-around',
            alignItems: 'center',
            opacity: tabBarOpacity,
          }
        : { display: 'none' },
    });
  }, [shouldDisplayTabBar, tabBarOpacity]);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          jwtDecode(token);
        } catch (e) {
          console.error('Erreur token:', e);
        }
      }
      const [resWallet, resTransactions] = await Promise.all([
        apiFetch(`${API_BASE_URL}/api/wallets/show`, { method: 'GET' }),
        apiFetch(`${API_BASE_URL}/api/transactions/show`, { method: 'GET' }),
      ]);
      if (!resWallet || !resTransactions) return;
      const walletData = await resWallet.json();
      const transactionData = await resTransactions.json();
      setWallet(walletData.wallet.balance);
      setTransactions(transactionData.transactions);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hide = showDeposit || showWithdraw;
    if (hide) {
      Animated.timing(tabBarOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShouldDisplayTabBar(false));
    } else {
      setShouldDisplayTabBar(true);
      Animated.timing(tabBarOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showDeposit, showWithdraw]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const getTransactionIcon = (type : string) => {
    switch (type) {
      case 'deposit':
        return <Download size={20} color="#158EFA" />;
      case 'withdrawal':
        return <Upload size={20} color="#158EFA" />;
      default:
        return <CreditCard size={20} color="#158EFA" />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* En-tête avec dégradé */}
        <View style={{ position: 'relative' }}>
          <LinearGradient
            colors={['#158EFA', '#158EFF', '#158fff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
          >
            <View style={styles.headerTop}>
              <Solde balance={Number(wallet)} color="#ffffff" />
            </View>
          </LinearGradient>

          <View style={styles.carouselSection}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(event) => {
                const slide = Math.round(event.nativeEvent.contentOffset.x / 320);
                setActiveSlide(slide);
              }}
              scrollEventThrottle={16}
              contentContainerStyle={styles.carouselContent}
            >
              <TouchableOpacity
                activeOpacity={0.95}
                style={styles.cardWrapper}
                onPress={() => setShowDeposit(true)}
              >
                <LinearGradient
                  colors={['#006b05ff', '#409745ff', '#006b05ff']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.card}
                >
                  <View style={styles.cardCenter}>
                    <Download size={48} color="#FFFFFF" />
                    <Text style={styles.cardTitle}>Dépôt</Text>
                    <Text style={styles.cardSubtitle}>Effectuer un dépôt</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.95}
                style={styles.cardWrapper}
                onPress={() => setShowWithdraw(true)}
              >
                <LinearGradient
                  colors={['#ca2200ff', '#c85c47ff', '#ca2200ff']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.card}
                >
                  <View style={styles.cardCenter}>
                    <Upload size={48} color="#FFFFFF" />
                    <Text style={styles.cardTitle}>Retrait</Text>
                    <Text style={styles.cardSubtitle}>Effectuer un retrait</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.dotsContainer}>
              {[0, 1].map((index) => (
                <View
                  key={index}
                  style={[styles.dot, activeSlide === index && styles.activeDot]}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.transactionsSection}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>Transactions récentes</Text>
          </View>

          <View style={styles.filterRow}>
            {[
              { key: 'all', label: 'Toutes' },
              { key: 'validated', label: 'Validées' },
              { key: 'rejected', label: 'Rejetées' },
              { key: 'pending', label: 'En attente' },
            ].map((f) => (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.filterButton,
                  filter === f.key && styles.filterButtonActive,
                ]}
                onPress={() => setFilter(f.key)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === f.key && styles.filterTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {!loading && filteredTransactions.length === 0 && (
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#6B7280' }}>
              Aucune transaction trouvée.
            </Text>
          )}
          {paginatedTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                {getTransactionIcon(transaction.type)}
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>
                  {transaction.type === 'deposit_request'
                    ? 'Dépôt'
                    : transaction.type === 'withdrawal_request'
                    ? 'Retrait'
                    : 'Paiement'}
                </Text>
                <Text style={styles.transactionRef}>
                  {transaction.reference}
                </Text>
                <Text style={styles.transactionDate}>
                  {transaction.date + ' à ' + transaction.hour}
                </Text>
              </View>
              <View style={styles.transactionRight}>
                <Text style={styles.transactionAmount}>
                  Ar {transaction.amount.toLocaleString()}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    transaction.status === 'validé' && styles.statusConfirmed,
                    transaction.status === 'en attente' && styles.statusPending,
                    transaction.status === 'rejeté' && styles.statusCancelled,
                  ]}
                >
                  <Text style={styles.statusText}>{transaction.status}</Text>
                </View>
              </View>
            </View>
          ))}
          {/* Pagination */}
          {totalPages > 1 && (
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[styles.pageButton, page === 1 && styles.disabledButton]}
                disabled={page === 1}
                onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                <Text style={styles.pageButtonText}>◀</Text>
              </TouchableOpacity>

              <Text style={styles.pageIndicator}>
                Page {page} / {totalPages}
              </Text>

              <TouchableOpacity
                style={[styles.pageButton, page === totalPages && styles.disabledButton]}
                disabled={page === totalPages}
                onPress={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              >
                <Text style={styles.pageButtonText}>▶</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <BottomModal
        title="Recharger votre compte"
        visible={showDeposit}
        onClose={() => setShowDeposit(false)}
      >
        <DepositForm balance={wallet} onClose={() => setShowDeposit(false)} />
      </BottomModal>

      <BottomModal
        title="Retirer votre argent"
        visible={showWithdraw}
        onClose={() => setShowWithdraw(false)}
      >
        <WithdrawForm balance={wallet} onClose={() => setShowWithdraw(false)} />
      </BottomModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', paddingBottom: 70 },
  gradientBackground: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  carouselSection: {
    marginTop: -100, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContent: { alignItems: 'center', paddingHorizontal: 10 },
  cardWrapper: { width: 320, marginRight: 20 },
  card: {
    borderRadius: 20,
    padding: 20,
    height: 200,
    justifyContent: 'space-between',
  },
  cardCenter: { alignItems: 'center', justifyContent: 'center', flex: 1, gap: 8 },
  cardTitle: { fontSize: 24, fontWeight: '700', color: '#FFFFFF', marginTop: 8 },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  activeDot: {
    backgroundColor: '#111827',
    transform: [{ scale: 1.2 }],
  },
  transactionsSection: { padding: 20, marginTop: 10 },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionsTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A' },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E8F1FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: { flex: 1 },
  transactionTitle: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginBottom: 4 },
  transactionRef: { fontSize: 13, color: '#6B7280', marginBottom: 2 },
  transactionDate: { fontSize: 13, color: '#8E9AAF' },
  transactionRight: { alignItems: 'flex-end' },
  transactionAmount: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12},
  statusConfirmed: { backgroundColor: '#D4F4E2' },
  statusPending: { backgroundColor: '#FFE8CC' },
  statusCancelled: { backgroundColor: '#FFE0E0' },
  statusText: { fontSize: 11, fontWeight: '600', color: '#1A1A1A' },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  filterButtonActive: { backgroundColor: '#4F8FF720', borderColor: '#158EFA', borderWidth: 1 },
  filterText: { fontSize: 13, fontWeight: '600', color: '#1A1A1A' },
  filterTextActive: { color: '#000000' },

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,
  },
  pageButton: {
    backgroundColor: '#158EFA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  disabledButton: {
    backgroundColor: '#A0AEC0',
  },
  pageButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  pageIndicator: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },

});
