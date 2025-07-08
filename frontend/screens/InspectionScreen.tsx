import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getLineItems } from '../services/api';
import { InspectionItemCard, Button, SyncStatusBadge } from '../components';
import InspectionTimer from '../components/InspectionTimer';
import ProgressBar from '../components/ProgressBar';
import FlashlightToggle from '../components/FlashlightToggle';
import { DEFAULT_INSPECTION_ITEMS } from '../constants/defaultInspectionItems';
import { SyncContext } from '../contexts';
import { useTheme } from '../hooks';
import type { InspectionItem } from '../components/InspectionItemCard';

interface RouteParams {
  order: {
    estimateNo: number;
  };
}

export default function InspectionScreen() {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const navigation = useNavigation<any>();
  const order = (route.params as RouteParams).order;
  const [items, setItems] = useState<InspectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { theme } = useTheme();
  const { enqueue } = useContext(SyncContext);

  useEffect(() => {
    // Use default inspection items for testing
    const mapped = DEFAULT_INSPECTION_ITEMS.map((d) => ({
      id: d.id,
      partNumber: d.partNumber,
      description: d.description,
      position: d.position,
      status: null,
      requiresMeasurement: d.requiresMeasurement || false,
      specification: d.specification || null,
      category: d.category || 'Other',
    }));
    console.log('Categories found:', [...new Set(mapped.map(item => item.category))]);
    setItems(mapped);
    setLoading(false);
  }, [order]);

  const updateItem = (updated: InspectionItem) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const handleSubmit = async () => {
    const completedItems = items.filter(item => item.status !== null);
    if (completedItems.length < items.length) {
      const proceed = await new Promise(resolve => {
        Alert.alert(
          'Incomplete Inspection',
          `${items.length - completedItems.length} items not inspected. Continue anyway?`,
          [
            { text: 'Cancel', onPress: () => resolve(false) },
            { text: 'Continue', onPress: () => resolve(true) }
          ]
        );
      });
      if (!proceed) return;
    }
    
    navigation.navigate('CustomerReport', { 
      order, 
      items, 
      technicianName: 'John Smith',
      shopInfo: { name: 'Professional Auto Service', phone: '(555) 123-4567' }
    });
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#ff00ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>{error}</Text>
      </View>
    );
  }

  const groupedItems = items.reduce((acc, item) => {
    const category = (item as any).category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, InspectionItem[]>);

  const categories = Object.keys(groupedItems).sort();
  const currentCategory = categories[activeTab] || categories[0];
  const currentItems = groupedItems[currentCategory] || [];
  const completedItems = items.filter(item => item.status !== null);
  const categoryCompleted = currentItems.filter(item => item.status !== null).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: 40 }]}>
      <View style={styles.headerRow}>
        <SyncStatusBadge />
        <View style={styles.tools}>
          <FlashlightToggle />
          <InspectionTimer />
        </View>
      </View>
      <ProgressBar completed={completedItems.length} total={items.length} />
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
        {categories.map((category, index) => {
          const categoryItems = groupedItems[category] || [];
          const completed = categoryItems.filter(item => item.status !== null).length;
          const isActive = activeTab === index;
          
          return (
            <TouchableOpacity
              key={`${category}-${index}`}
              style={[
                styles.tab,
                isActive && styles.activeTab,
                completed === categoryItems.length && categoryItems.length > 0 && styles.completedTab
              ]}
              onPress={() => {
                console.log('Tab clicked:', category, index);
                setActiveTab(index);
              }}
            >
              <Text style={[
                styles.tabText,
                isActive && styles.activeTabText,
                { color: isActive ? '#fff' : '#333' }
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {currentCategory && (
        <View style={styles.categoryHeader}>
          <Text style={[styles.categoryTitle, { color: theme.text }]}>
            {currentCategory} ({categoryCompleted}/{currentItems.length})
          </Text>
        </View>
      )}
      
      <FlatList
        data={currentItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <InspectionItemCard item={item} onChange={updateItem} />
        )}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.bottomNav}>
        <View style={styles.navButtons}>
          <Button
            title="← Prev"
            onPress={() => setActiveTab(Math.max(0, activeTab - 1))}
            disabled={activeTab === 0}
            style={[styles.navButton, activeTab === 0 && styles.disabledButton]}
          />
          <Button
            title="Next →"
            onPress={() => setActiveTab(Math.min(categories.length - 1, activeTab + 1))}
            disabled={activeTab === categories.length - 1}
            style={[styles.navButton, activeTab === categories.length - 1 && styles.disabledButton]}
          />
        </View>
        <Button 
          title="Submit Inspection" 
          onPress={handleSubmit} 
          loading={submitting}
          style={styles.submitButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submit: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tools: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tabContainer: {
    paddingVertical: 8,
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    minWidth: 100,
    height: 44,
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  completedTab: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  tabCount: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  categoryHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomNav: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navButton: {
    flex: 0.45,
    backgroundColor: '#f0f0f0',
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
});
