import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { AuthContext } from '../contexts';
import { useTheme } from '../hooks';
import { getMechanics, loginMechanic } from '../services/api';
import PinModal from '../components/PinModal';

const COMPANY_ID = 7638;
const { width } = Dimensions.get('window');

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
};

interface EnhancedMechanicCardProps {
  mechanic: any;
  onPress: () => void;
  index: number;
}

const EnhancedMechanicCard: React.FC<EnhancedMechanicCardProps> = ({ 
  mechanic, 
  onPress, 
  index 
}) => {
  const animatedValue = new Animated.Value(0);
  
  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={[
        styles.mechanicCardContainer,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Pressable
        style={({ pressed }) => [
          styles.mechanicCard,
          pressed && styles.mechanicCardPressed,
        ]}
        onPress={onPress}
        android_ripple={{
          color: COLORS.magenta + '20',
          borderless: false,
        }}
      >
        <View style={styles.mechanicAvatar}>
          <Text style={styles.mechanicInitials}>
            {mechanic.firstName?.[0]?.toUpperCase() || '?'}
            {mechanic.lastName?.[0]?.toUpperCase() || ''}
          </Text>
        </View>
        
        <View style={styles.mechanicInfo}>
          <Text style={styles.mechanicName}>
            {mechanic.firstName} {mechanic.lastName}
          </Text>
          <Text style={styles.mechanicId}>
            ID: {mechanic.mechanicId}
          </Text>
          <View style={styles.mechanicBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Available</Text>
          </View>
        </View>
        
        <View style={styles.mechanicAction}>
          <View style={styles.actionIcon}>
            <Text style={styles.actionIconText}>→</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default function MechanicSelectScreen() {
  const { login } = useContext(AuthContext);
  const { theme } = useTheme();
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        console.log('📡 Fetching mechanics for company ID:', COMPANY_ID);
        const list = await getMechanics(COMPANY_ID);
        console.log('✅ Mechanics loaded:', list);
        setMechanics(list);
      } catch (e) {
        console.error('❌ Failed to load mechanics:', e);
        setError('Failed to load mechanics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSelect = (id: string) => {
    setSelected(id);
    setModal(true);
  };

  const handleLogin = async (pin: string) => {
    if (!selected) return;
    try {
      console.log('🔐 Attempting login with', {
        companyId: COMPANY_ID,
        mechanicId: selected,
        pin,
      });

      const res = await loginMechanic({
        mechanicId: parseInt(selected, 10),
        pin,
      });

      console.log('✅ Login success:', res);
      login(String(res.mechanicId), res.token);
    } catch (e) {
      console.error('❌ Login failed:', e);
      setError('Incorrect PIN or login failed.');
    } finally {
      setModal(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.charcoal} />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <View style={styles.loadingIconContainer}>
              <ActivityIndicator 
                size="large" 
                color={COLORS.magenta} 
              />
            </View>
            <Text style={styles.loadingTitle}>Loading Team</Text>
            <Text style={styles.loadingSubtitle}>
              Fetching available mechanics for inspection
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
        <View style={styles.headerGradient} />
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>Select Mechanic</Text>
              <Text style={styles.headerSubtitle}>
                Choose your profile to begin inspection
              </Text>
            </View>
            <View style={styles.headerLogo}>
              <Text style={styles.logoText}>K</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerAccent} />
      </View>

      <View style={styles.container}>
        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <View style={styles.errorHeader}>
              <View style={styles.errorIcon}>
                <Text style={styles.errorIconText}>⚠</Text>
              </View>
              <Text style={styles.errorTitle}>Authentication Failed</Text>
            </View>
            <Text style={styles.errorMessage}>{error}</Text>
            <Pressable 
              style={styles.errorButton}
              onPress={() => setError(null)}
            >
              <Text style={styles.errorButtonText}>Dismiss</Text>
            </Pressable>
          </View>
        )}

        {/* Content */}
        {mechanics.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateCard}>
              <View style={styles.emptyStateIcon}>
                <Text style={styles.emptyStateIconText}>👥</Text>
              </View>
              <Text style={styles.emptyStateTitle}>No Mechanics Available</Text>
              <Text style={styles.emptyStateMessage}>
                Unable to find any mechanics for company ID {COMPANY_ID}.
              </Text>
              <View style={styles.emptyStateDetails}>
                <Text style={styles.detailsTitle}>Required Configuration:</Text>
                <Text style={styles.detailsItem}>• MobileEnabled = 1</Text>
                <Text style={styles.detailsItem}>• HOME_SHOP = {COMPANY_ID}</Text>
              </View>
              <Pressable style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contact Administrator</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.mechanicsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Team Members</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{mechanics.length}</Text>
              </View>
            </View>
            
            <FlatList
              data={mechanics}
              keyExtractor={(m) => m.mechanicId}
              renderItem={({ item, index }) => (
                <EnhancedMechanicCard
                  mechanic={item}
                  onPress={() => handleSelect(item.mechanicId)}
                  index={index}
                />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            />
          </View>
        )}

        <PinModal
          visible={modal}
          onClose={() => setModal(false)}
          onSubmit={handleLogin}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.charcoal,
  },

  // Loading States
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.biscuit,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 48,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 12,
    width: width * 0.85,
    maxWidth: 320,
  },
  loadingIconContainer: {
    marginBottom: 24,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.charcoal,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  loadingSubtitle: {
    fontSize: 15,
    color: COLORS.mediumGray,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Enhanced Header
  headerContainer: {
    backgroundColor: COLORS.charcoal,
    position: 'relative',
    paddingBottom: 32,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.charcoal,
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 6,
    letterSpacing: -0.8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.biscuit,
    fontWeight: '400',
    opacity: 0.9,
    lineHeight: 22,
  },
  headerLogo: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.magenta,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
  },
  headerAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: COLORS.magenta,
  },

  // Main Container
  container: {
    flex: 1,
    backgroundColor: COLORS.biscuit,
  },

  // Enhanced Error States
  errorContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 16,
    padding: 24,
    borderLeftWidth: 6,
    borderLeftColor: COLORS.errorRed,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  errorIcon: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.errorRed + '15',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  errorIconText: {
    fontSize: 16,
    color: COLORS.errorRed,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.errorRed,
  },
  errorMessage: {
    fontSize: 15,
    color: COLORS.darkGray,
    lineHeight: 22,
    marginBottom: 16,
  },
  errorButton: {
    backgroundColor: COLORS.errorRed + '10',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  errorButtonText: {
    color: COLORS.errorRed,
    fontWeight: '600',
    fontSize: 14,
  },

  // Enhanced Empty State
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyStateCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 12,
    width: '100%',
    maxWidth: 360,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.lightGray,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateIconText: {
    fontSize: 36,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.charcoal,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  emptyStateMessage: {
    fontSize: 16,
    color: COLORS.mediumGray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyStateDetails: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  detailsItem: {
    fontSize: 14,
    color: COLORS.mediumGray,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  contactButton: {
    backgroundColor: COLORS.magenta,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  contactButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },

  // Mechanics Section
  mechanicsSection: {
    flex: 1,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.charcoal,
    letterSpacing: -0.3,
  },
  countBadge: {
    backgroundColor: COLORS.magenta,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  countText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // Enhanced Mechanic Cards
  mechanicCardContainer: {
    marginHorizontal: 24,
  },
  mechanicCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  mechanicCardPressed: {
    backgroundColor: COLORS.lightGray,
    transform: [{ scale: 0.98 }],
  },
  mechanicAvatar: {
    width: 56,
    height: 56,
    backgroundColor: COLORS.magenta,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  mechanicInitials: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  mechanicInfo: {
    flex: 1,
  },
  mechanicName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.charcoal,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  mechanicId: {
    fontSize: 14,
    color: COLORS.mediumGray,
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  mechanicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: COLORS.successGreen,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.successGreen,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mechanicAction: {
    marginLeft: 16,
  },
  actionIcon: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.magenta + '15',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIconText: {
    fontSize: 18,
    color: COLORS.magenta,
    fontWeight: '600',
  },

  // List Styling
  listContent: {
    paddingBottom: 32,
  },
  itemSeparator: {
    height: 16,
  },
});