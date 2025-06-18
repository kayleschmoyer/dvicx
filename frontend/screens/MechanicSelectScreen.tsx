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

interface EnhancedMechanicCardProps {
  mechanic: any;
  onPress: () => void;
  index: number;
}

const EnhancedMechanicCard: React.FC<EnhancedMechanicCardProps> = ({
  mechanic,
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

  const getInitials = (firstName: string, lastName: string) => {
    const first = firstName?.[0]?.toUpperCase() || '';
    const last = lastName?.[0]?.toUpperCase() || '';
    return first + last || '?';
  };

  return (
    <Animated.View
      style={[
        styles.mechanicCardContainer,
        {
          opacity,
          transform: [{ translateY }, { scale: scaleValue }],
        },
      ]}
    >
      <Pressable
        style={[styles.mechanicCard, { backgroundColor: theme.background }]}
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
          <View style={styles.mechanicAvatar}>
            <Text style={styles.mechanicInitials}>
              {getInitials(mechanic.firstName, mechanic.lastName)}
            </Text>
            <View style={styles.avatarGlow} />
          </View>
          
          <View style={styles.mechanicInfo}>
            <Text style={[styles.mechanicName, TYPOGRAPHY.titleLarge, { color: theme.text }]}>
              {mechanic.firstName} {mechanic.lastName}
            </Text>
            <Text style={[styles.mechanicId, TYPOGRAPHY.bodyMedium, { color: theme.text }]}>
              ID: {mechanic.mechanicId}
            </Text>
            <View style={styles.mechanicBadge}>
              <View style={styles.statusIndicator}>
                <View style={styles.statusDot} />
                <Text style={[styles.statusText, TYPOGRAPHY.labelMedium]}>
                  AVAILABLE
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.mechanicAction}>
            <View style={styles.actionButton}>
              <Text style={styles.actionButtonText}>→</Text>
            </View>
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

  const loadMechanics = async () => {
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

  useEffect(() => {
    loadMechanics();
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
        <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
          <View style={styles.loadingCard}>
            <View style={styles.loadingAnimation}>
              <ActivityIndicator 
                size="large" 
                color={COLORS.magenta} 
              />
              <View style={styles.loadingPulse} />
            </View>
            <Text style={[styles.loadingTitle, TYPOGRAPHY.headlineMedium]}>
              Loading Team
            </Text>
            <Text style={[styles.loadingSubtitle, TYPOGRAPHY.bodyMedium]}>
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
        <View style={styles.headerBackground} />
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.headerText}>
              <Text style={[styles.headerTitle, TYPOGRAPHY.displayLarge]}>
                Select Mechanic
              </Text>
              <Text style={[styles.headerSubtitle, TYPOGRAPHY.bodyLarge]}>
                Choose your profile to begin inspection
              </Text>
            </View>
            <View style={styles.headerBrand}>
              <View style={styles.brandLogo}>
                <Text style={[styles.logoText, TYPOGRAPHY.headlineLarge]}>K</Text>
              </View>
            </View>
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
                    Authentication Failed
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
        {mechanics.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateCard}>
              <View style={styles.emptyStateHeader}>
                <View style={styles.emptyStateIcon}>
                  <Text style={styles.emptyStateEmoji}>👥</Text>
                </View>
                <Text style={[styles.emptyStateTitle, TYPOGRAPHY.headlineLarge]}>
                  No Mechanics Available
                </Text>
                <Text style={[styles.emptyStateMessage, TYPOGRAPHY.bodyLarge]}>
                  Unable to find any mechanics for company ID {COMPANY_ID}.
                </Text>
              </View>
              
              <View style={styles.emptyStateDetails}>
                <Text style={[styles.detailsTitle, TYPOGRAPHY.labelLarge]}>
                  Required Configuration:
                </Text>
                <View style={styles.detailsList}>
                  <Text style={[styles.detailsItem, TYPOGRAPHY.bodyMedium]}>
                    • MobileEnabled = 1
                  </Text>
                  <Text style={[styles.detailsItem, TYPOGRAPHY.bodyMedium]}>
                    • HOME_SHOP = {COMPANY_ID}
                  </Text>
                </View>
              </View>
              
              <Pressable style={styles.contactButton}>
                <Text style={[styles.contactButtonText, TYPOGRAPHY.titleMedium]}>
                  Contact Administrator
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.mechanicsSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, TYPOGRAPHY.headlineMedium]}>
                Team Members
              </Text>
              <View style={styles.countBadge}>
                <Text style={[styles.countText, TYPOGRAPHY.labelLarge]}>
                  {mechanics.length}
                </Text>
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
          onClose={() => {
            setModal(false);
            setSelected(null);
            loadMechanics();
          }}
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

  // Enhanced Loading States
  loadingContainer: {
    flex: 1,
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
  headerBrand: {
    alignItems: 'center',
  },
  brandLogo: {
    width: 56,
    height: 56,
    backgroundColor: COLORS.magenta,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.magenta,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
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
    fontFamily: 'monospace',
  },
  contactButton: {
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
  contactButtonText: {
    color: COLORS.white,
  },

  // Mechanics Section
  mechanicsSection: {
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

  // Premium Mechanic Cards
  mechanicCardContainer: {
    marginHorizontal: 24,
  },
  mechanicCard: {
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  mechanicAvatar: {
    position: 'relative',
    width: 64,
    height: 64,
    backgroundColor: COLORS.magenta,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatarGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 36,
    backgroundColor: COLORS.magenta + '20',
    zIndex: -1,
  },
  mechanicInitials: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
  },
  mechanicInfo: {
    flex: 1,
  },
  mechanicName: {
    marginBottom: 6,
  },
  mechanicId: {
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  mechanicBadge: {
    alignSelf: 'flex-start',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successGreen + '15',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    backgroundColor: COLORS.successGreen,
    borderRadius: 3,
    marginRight: 8,
  },
  statusText: {
    color: COLORS.successGreen,
  },
  mechanicAction: {
    marginLeft: 20,
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