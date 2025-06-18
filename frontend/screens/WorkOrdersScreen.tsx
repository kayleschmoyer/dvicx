import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  Text, 
  SafeAreaView,
  RefreshControl,
  StatusBar,
  Pressable,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../contexts';
import { useTheme } from '../hooks';
import { getWorkOrders } from '../services/api';
import WorkOrderCard from '../components/WorkOrderCard';
import { ThemeToggle, SyncStatusBadge, Button } from '../components';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Klipboard Brand Colors
const COLORS = {
  charcoal: '#212121',
  magenta: '#E6007A',
  biscuit: '#F5F5DC',
  white: '#FFFFFF',
  errorRed: '#DC3545',
  successGreen: '#28A745',
  lightGray: '#F8F9FA',
  mediumGray: '#6C757D',
  darkGray: '#495057',
  shadow: 'rgba(33, 33, 33, 0.15)',
  overlay: 'rgba(33, 33, 33, 0.05)',
};

// Enhanced Typography Scale
const TYPOGRAPHY = {
  displayLarge: {
    fontSize: 32,
    fontWeight: '800' as '800',
    letterSpacing: -1.2,
    lineHeight: 38,
  },
  headlineLarge: {
    fontSize: 24,
    fontWeight: '700' as '700',
    letterSpacing: -0.6,
    lineHeight: 30,
  },
  headlineMedium: {
    fontSize: 20,
    fontWeight: '700' as '700',
    letterSpacing: -0.4,
    lineHeight: 26,
  },
  titleLarge: {
    fontSize: 18,
    fontWeight: '600' as '600',
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  titleMedium: {
    fontSize: 16,
    fontWeight: '600' as '600',
    letterSpacing: -0.1,
    lineHeight: 22,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as '400',
    letterSpacing: 0,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as '400',
    letterSpacing: 0,
    lineHeight: 20,
  },
  labelLarge: {
    fontSize: 14,
    fontWeight: '600' as '600',
    letterSpacing: 0.1,
    lineHeight: 18,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '600' as '600',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: '500' as '500',
    letterSpacing: 0.8,
    lineHeight: 14,
  },
};

interface WorkOrder {
  estimateNo: number;
  firstName: string;
  lastName: string;
  carYear: string;
  make: string;
  model: string;
  engineType: string;
  license: string;
  date: string;
  status: string;
}

interface EnhancedWorkOrderCardProps {
  order: WorkOrder;
  onPress: () => void;
  index: number;
}

const EnhancedWorkOrderCard: React.FC<EnhancedWorkOrderCardProps> = ({
  order,
  onPress,
  index,
}) => {
  const animatedValue = new Animated.Value(0);
  const scaleValue = new Animated.Value(1);
  const { theme } = useTheme();
  
  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 400,
      delay: index * 80,
      useNativeDriver: true,
    }).start();
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case '1':
        return COLORS.magenta;
      case 'in_progress':
      case '2':
        return '#FF9500';
      case 'completed':
      case '3':
        return COLORS.successGreen;
      default:
        return COLORS.mediumGray;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case '1':
        return 'PENDING';
      case '2':
        return 'IN PROGRESS';
      case '3':
        return 'COMPLETED';
      default:
        return 'UNKNOWN';
    }
  };

  return (
    <Animated.View
      style={[
        styles.workOrderCardContainer,
        {
          opacity,
          transform: [{ translateY }, { scale: scaleValue }],
        },
      ]}
    >
      <Pressable
        style={[styles.workOrderCard, { backgroundColor: theme.background }]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        android_ripple={{
          color: COLORS.magenta + '15',
          borderless: false,
          radius: 180,
        }}
      >
        <View style={styles.cardContent}>
          <View style={styles.orderHeader}>
            <View style={styles.orderInfo}>
              <Text
                style={[styles.customerName, TYPOGRAPHY.titleLarge, { color: theme.text }]}
              >
                {order.firstName} {order.lastName}
              </Text>
              <Text
                style={[styles.vehicleInfo, TYPOGRAPHY.bodyMedium, { color: theme.text }]}
              >
                {order.carYear} {order.make} {order.model}
              </Text>
              <Text
                style={[styles.estimateNumber, TYPOGRAPHY.labelMedium, { color: theme.text }]}
              >
                EST #{order.estimateNo}
              </Text>
            </View>
            
            <View style={styles.orderStatus}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(order.status) }]} />
                <Text style={[styles.statusText, TYPOGRAPHY.labelMedium, { color: getStatusColor(order.status) }]}>
                  {getStatusText(order.status)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.orderDetails}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, TYPOGRAPHY.labelSmall, { color: theme.text }]}>ENGINE</Text>
              <Text style={[styles.detailValue, TYPOGRAPHY.bodyMedium, { color: theme.text }]}>{order.engineType}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, TYPOGRAPHY.labelSmall, { color: theme.text }]}>LICENSE</Text>
              <Text style={[styles.detailValue, TYPOGRAPHY.bodyMedium, { color: theme.text }]}>{order.license}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, TYPOGRAPHY.labelSmall, { color: theme.text }]}>DATE</Text>
              <Text style={[styles.detailValue, TYPOGRAPHY.bodyMedium, { color: theme.text }]}>
                {new Date(order.date).toLocaleDateString()}
              </Text>
            </View>
          </View>
          
          <View style={styles.orderAction}>
            <View style={styles.actionButton}>
              <Text style={styles.actionButtonText}>→</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default function WorkOrdersScreen() {
  const { mechanicId, token, logout } = useContext(AuthContext);
  const { theme } = useTheme();
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<any>();

  const loadWorkOrders = async (isRefresh = false) => {
    if (!mechanicId) return;
    
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    setError(null);

    try {
      console.log('📡 Fetching work orders for mechanic ID:', mechanicId);
      const data = await getWorkOrders(mechanicId, token || undefined);
      console.log('✅ Work orders loaded:', data);
      setOrders(data);
      
      if (Array.isArray(data) && data.length === 0) {
        setError('No work orders assigned to this mechanic');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('❌ Error loading work orders:', err.response?.data || err.message);
        if (err.response?.status === 404) {
          setError('No work orders assigned to this mechanic');
        } else {
          setError('Failed to load work orders. Please try again.');
        }
      } else {
        console.error('❌ Error loading work orders:', err);
        setError('Failed to load work orders. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWorkOrders();
  }, [mechanicId, token]);

  const onRefresh = () => {
    loadWorkOrders(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.charcoal} />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <View style={styles.loadingAnimation}>
              <ActivityIndicator 
                size="large" 
                color={COLORS.magenta} 
              />
              <View style={styles.loadingPulse} />
            </View>
            <Text style={[styles.loadingTitle, TYPOGRAPHY.headlineMedium]}>
              Loading Orders
            </Text>
            <Text style={[styles.loadingSubtitle, TYPOGRAPHY.bodyMedium]}>
              Fetching your assigned work orders
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.charcoal} />
      
      {/* Enhanced Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerBackground} />
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.headerText}>
              <Text style={[styles.headerTitle, TYPOGRAPHY.displayLarge]}>
                Work Orders
              </Text>
              <Text style={[styles.headerSubtitle, TYPOGRAPHY.bodyLarge]}>
                {orders.length} {orders.length === 1 ? 'order' : 'orders'} assigned to you
              </Text>
            </View>
            <View style={styles.headerControls}>
              <SyncStatusBadge />
              <ThemeToggle />
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <Pressable 
              style={styles.logoutButton}
              onPress={logout}
            >
              <Text style={[styles.logoutButtonText, TYPOGRAPHY.titleMedium]}>
                Logout
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.headerDivider} />
      </View>

      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Enhanced Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <View style={styles.errorCard}>
              <View style={styles.errorHeader}>
                <View style={styles.errorIconContainer}>
                  <Text style={styles.errorIcon}>⚠</Text>
                </View>
                <View style={styles.errorContent}>
                  <Text style={[styles.errorTitle, TYPOGRAPHY.titleLarge]}>
                    No Orders Found
                  </Text>
                  <Text style={[styles.errorMessage, TYPOGRAPHY.bodyMedium]}>
                    {error}
                  </Text>
                </View>
              </View>
              <Pressable 
                style={styles.errorButton}
                onPress={() => setError(null)}
              >
                <Text style={[styles.errorButtonText, TYPOGRAPHY.labelLarge]}>
                  Dismiss
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Main Content */}
        {orders.length === 0 && !error ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateCard}>
              <View style={styles.emptyStateHeader}>
                <View style={styles.emptyStateIcon}>
                  <Text style={styles.emptyStateEmoji}>📋</Text>
                </View>
                <Text style={[styles.emptyStateTitle, TYPOGRAPHY.headlineLarge]}>
                  No Work Orders
                </Text>
                <Text style={[styles.emptyStateMessage, TYPOGRAPHY.bodyLarge]}>
                  You don't have any work orders assigned at the moment.
                </Text>
              </View>
              
              <View style={styles.emptyStateDetails}>
                <Text style={[styles.detailsTitle, TYPOGRAPHY.labelLarge]}>
                  What's next:
                </Text>
                <View style={styles.detailsList}>
                  <Text style={[styles.detailsItem, TYPOGRAPHY.bodyMedium]}>
                    • New orders will appear here automatically
                  </Text>
                  <Text style={[styles.detailsItem, TYPOGRAPHY.bodyMedium]}>
                    • Pull down to refresh and check for updates
                  </Text>
                  <Text style={[styles.detailsItem, TYPOGRAPHY.bodyMedium]}>
                    • Contact dispatch for immediate assignments
                  </Text>
                </View>
              </View>
              
              <Pressable 
                style={styles.refreshButton}
                onPress={onRefresh}
              >
                <Text style={[styles.refreshButtonText, TYPOGRAPHY.titleMedium]}>
                  Refresh Orders
                </Text>
              </Pressable>
            </View>
          </View>
        ) : orders.length > 0 ? (
          <View style={styles.ordersSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, TYPOGRAPHY.headlineMedium]}>
                Assigned Orders
              </Text>
              <View style={styles.countBadge}>
                <Text style={[styles.countText, TYPOGRAPHY.labelLarge]}>
                  {orders.length}
                </Text>
              </View>
            </View>
            
            <FlatList
              data={orders}
              keyExtractor={(item) => item.estimateNo.toString()}
              renderItem={({ item, index }) => (
                <EnhancedWorkOrderCard
                  order={item}
                  onPress={() => navigation.navigate('Inspection', { order: item })}
                  index={index}
                />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[COLORS.magenta]}
                  tintColor={COLORS.magenta}
                />
              }
              ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.charcoal,
  },

  // Enhanced Loading States
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.biscuit,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingVertical: 56,
    paddingHorizontal: 40,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 16,
    width: width * 0.85,
    maxWidth: 340,
  },
  loadingAnimation: {
    position: 'relative',
    marginBottom: 32,
  },
  loadingPulse: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 30,
    backgroundColor: COLORS.magenta + '10',
  },
  loadingTitle: {
    color: COLORS.charcoal,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtitle: {
    color: COLORS.mediumGray,
    textAlign: 'center',
  },

  // Premium Header Design
  headerContainer: {
    backgroundColor: COLORS.charcoal,
    position: 'relative',
    paddingBottom: 40,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.charcoal,
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerText: {
    flex: 1,
    paddingRight: 16,
  },
  headerTitle: {
    color: COLORS.white,
    marginBottom: 8,
  },
  headerSubtitle: {
    color: COLORS.biscuit,
    opacity: 0.9,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerActions: {
    alignItems: 'flex-end',
  },
  logoutButton: {
    backgroundColor: COLORS.magenta,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: COLORS.magenta,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: COLORS.white,
  },
  headerDivider: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: COLORS.magenta,
    opacity: 0.5,
  },

  // Main Container
  container: {
    flex: 1,
  },

  // Refined Error States
  errorContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  errorCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.errorRed,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 12,
  },
  errorHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  errorIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.errorRed + '15',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  errorIcon: {
    fontSize: 18,
    color: COLORS.errorRed,
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    color: COLORS.errorRed,
    marginBottom: 6,
  },
  errorMessage: {
    color: COLORS.darkGray,
  },
  errorButton: {
    backgroundColor: COLORS.errorRed + '10',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  errorButtonText: {
    color: COLORS.errorRed,
  },

  // Sophisticated Empty State
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyStateCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 16,
    width: '100%',
    maxWidth: 380,
  },
  emptyStateHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emptyStateIcon: {
    width: 88,
    height: 88,
    backgroundColor: COLORS.overlay,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateEmoji: {
    fontSize: 40,
  },
  emptyStateTitle: {
    color: COLORS.charcoal,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateMessage: {
    color: COLORS.mediumGray,
    textAlign: 'center',
  },
  emptyStateDetails: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 32,
  },
  detailsTitle: {
    color: COLORS.darkGray,
    marginBottom: 12,
  },
  detailsList: {
    gap: 6,
  },
  detailsItem: {
    color: COLORS.mediumGray,
  },
  refreshButton: {
    backgroundColor: COLORS.magenta,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: COLORS.magenta,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  refreshButtonText: {
    color: COLORS.white,
  },

  // Work Orders Section
  ordersSection: {
    flex: 1,
    paddingTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.charcoal,
  },
  countBadge: {
    backgroundColor: COLORS.magenta,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: COLORS.magenta,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  countText: {
    color: COLORS.white,
  },

  // Premium Work Order Cards
  workOrderCardContainer: {
    marginHorizontal: 24,
  },
  workOrderCard: {
    borderRadius: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 24,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  orderInfo: {
    flex: 1,
    paddingRight: 16,
  },
  customerName: {
    color: COLORS.charcoal,
    marginBottom: 6,
  },
  vehicleInfo: {
    color: COLORS.mediumGray,
    marginBottom: 8,
  },
  estimateNumber: {
    color: COLORS.darkGray,
    fontFamily: 'monospace',
  },
  orderStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  statusText: {
    fontWeight: '600',
  },
  orderDetails: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: COLORS.mediumGray,
    textTransform: 'uppercase',
  },
  detailValue: {
    color: COLORS.darkGray,
    fontFamily: 'monospace',
  },
  orderAction: {
    alignItems: 'flex-end',
  },
  actionButton: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.magenta + '15',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.magenta,
  },

  // List Styling
  listContent: {
    paddingBottom: 40,
  },
  itemSeparator: {
    height: 16,
  },
});