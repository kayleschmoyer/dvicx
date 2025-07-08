import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import SignatureScreen from 'react-native-signature-canvas';
import { Button } from '../components';
import { useTheme } from '../hooks';
import type { InspectionItem } from '../components/InspectionItemCard';

interface RouteParams {
  order: any;
  items: InspectionItem[];
}

export default function InspectionSummaryScreen() {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const navigation = useNavigation<any>();
  const { order, items } = (route.params as RouteParams);
  const { theme } = useTheme();
  
  const [signature, setSignature] = useState<string>('');
  const [showSignature, setShowSignature] = useState(false);
  const signatureRef = useRef<any>();

  const redItems = items.filter(item => item.status === 'red');
  const yellowItems = items.filter(item => item.status === 'yellow');
  const greenItems = items.filter(item => item.status === 'green');
  const naItems = items.filter(item => item.status === 'na');

  const handleSignature = (sig: string) => {
    setSignature(sig);
    setShowSignature(false);
  };

  const handleSubmit = () => {
    if (!signature) {
      Alert.alert('Signature Required', 'Please provide your signature to complete the inspection');
      return;
    }
    
    // Submit inspection with signature
    navigation.navigate('WorkOrders');
  };

  const clearSignature = () => {
    signatureRef.current?.clearSignature();
    setSignature('');
  };

  if (showSignature) {
    return (
      <View style={styles.signatureContainer}>
        <Text style={[styles.signatureTitle, { color: theme.text }]}>
          Technician Signature
        </Text>
        <SignatureScreen
          ref={signatureRef}
          onOK={handleSignature}
          onEmpty={() => Alert.alert('Please provide signature')}
          descriptionText="Sign above"
          clearText="Clear"
          confirmText="Save"
          style={styles.signature}
        />
        <Button 
          title="Cancel" 
          onPress={() => setShowSignature(false)}
          style={styles.cancelButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Inspection Summary</Text>
        <Text style={[styles.vehicle, { color: theme.text }]}>
          {order.carYear} {order.make} {order.model}
        </Text>
        <Text style={[styles.customer, { color: theme.text }]}>
          {order.firstName} {order.lastName} • EST #{order.estimateNo}
        </Text>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryItem, styles.redSummary]}>
            <Text style={styles.summaryCount}>{redItems.length}</Text>
            <Text style={styles.summaryLabel}>Failed</Text>
          </View>
          <View style={[styles.summaryItem, styles.yellowSummary]}>
            <Text style={styles.summaryCount}>{yellowItems.length}</Text>
            <Text style={styles.summaryLabel}>Attention</Text>
          </View>
          <View style={[styles.summaryItem, styles.greenSummary]}>
            <Text style={styles.summaryCount}>{greenItems.length}</Text>
            <Text style={styles.summaryLabel}>Passed</Text>
          </View>
          <View style={[styles.summaryItem, styles.naSummary]}>
            <Text style={styles.summaryCount}>{naItems.length}</Text>
            <Text style={styles.summaryLabel}>N/A</Text>
          </View>
        </View>
      </View>

      {redItems.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.redText]}>Failed Items</Text>
          {redItems.map(item => (
            <View key={item.id} style={styles.itemSummary}>
              <Text style={[styles.itemText, { color: theme.text }]}>
                {item.partNumber} - {item.description}
                {item.position && ` (${item.position})`}
              </Text>
              {item.measurement && (
                <Text style={[styles.measurement, { color: theme.text }]}>
                  Measured: {item.measurement}
                </Text>
              )}
              {item.reason && (
                <Text style={[styles.reason, { color: theme.text }]}>
                  Reason: {item.reason}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {yellowItems.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.yellowText]}>Items Needing Attention</Text>
          {yellowItems.map(item => (
            <View key={item.id} style={styles.itemSummary}>
              <Text style={[styles.itemText, { color: theme.text }]}>
                {item.partNumber} - {item.description}
                {item.position && ` (${item.position})`}
              </Text>
              {item.measurement && (
                <Text style={[styles.measurement, { color: theme.text }]}>
                  Measured: {item.measurement}
                </Text>
              )}
              {item.reason && (
                <Text style={[styles.reason, { color: theme.text }]}>
                  Notes: {item.reason}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      <View style={styles.signatureSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Technician Sign-off</Text>
        {signature ? (
          <View style={styles.signaturePreview}>
            <Text style={[styles.signatureText, { color: theme.text }]}>Signature captured</Text>
            <Button title="Change Signature" onPress={() => setShowSignature(true)} />
          </View>
        ) : (
          <Button title="Add Signature" onPress={() => setShowSignature(true)} />
        )}
      </View>

      <View style={styles.actions}>
        <Button
          title="Complete Inspection"
          onPress={handleSubmit}
          style={styles.submitButton}
        />
        <Button
          title="Back to Edit"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  vehicle: {
    fontSize: 18,
    marginBottom: 4,
  },
  customer: {
    fontSize: 16,
    opacity: 0.7,
  },
  summary: {
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  redSummary: {
    backgroundColor: '#ffebee',
  },
  yellowSummary: {
    backgroundColor: '#fff8e1',
  },
  greenSummary: {
    backgroundColor: '#e8f5e8',
  },
  naSummary: {
    backgroundColor: '#f5f5f5',
  },
  summaryCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  redText: {
    color: '#d32f2f',
  },
  yellowText: {
    color: '#f57c00',
  },
  itemSummary: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
  },
  measurement: {
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
  },
  reason: {
    fontSize: 14,
    marginTop: 4,
  },
  signatureSection: {
    marginBottom: 24,
  },
  signaturePreview: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  signatureText: {
    marginBottom: 12,
  },
  signatureContainer: {
    flex: 1,
    padding: 16,
  },
  signatureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  signature: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButton: {
    marginTop: 16,
  },
  actions: {
    gap: 12,
    marginBottom: 32,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  backButton: {
    backgroundColor: '#757575',
  },
});