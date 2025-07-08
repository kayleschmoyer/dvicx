import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Button } from '../components';
import type { InspectionItem } from '../components/InspectionItemCard';

interface RouteParams {
  order: any;
  items: InspectionItem[];
  technicianName: string;
  shopInfo: any;
}

export default function CustomerReportScreen() {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { order, items, technicianName, shopInfo } = (route.params as RouteParams);

  const redItems = items.filter(item => item.status === 'red');
  const yellowItems = items.filter(item => item.status === 'yellow');
  const greenItems = items.filter(item => item.status === 'green');

  const getPriorityLevel = (item: InspectionItem) => {
    if (item.status === 'red') return 'IMMEDIATE ATTENTION';
    if (item.status === 'yellow') return 'MONITOR CLOSELY';
    return 'GOOD CONDITION';
  };

  const getRecommendation = (item: InspectionItem) => {
    if (item.status === 'red') {
      return 'We recommend addressing this issue immediately for your safety.';
    }
    if (item.status === 'yellow') {
      return 'This should be monitored and may need attention soon.';
    }
    return 'This component is in good condition.';
  };

  const sendReport = () => {
    // Would integrate with email service
    console.log('Sending customer report via email');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoSection}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>🔧</Text>
          </View>
          <View>
            <Text style={styles.shopName}>Professional Auto Service</Text>
            <Text style={styles.shopAddress}>123 Main St • (555) 123-4567</Text>
          </View>
        </View>
        <Text style={styles.reportTitle}>DIGITAL VEHICLE INSPECTION REPORT</Text>
      </View>

      {/* Vehicle & Customer Info */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Vehicle Information</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Customer:</Text>
            <Text style={styles.infoValue}>{order.firstName} {order.lastName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vehicle:</Text>
            <Text style={styles.infoValue}>{order.carYear} {order.make} {order.model}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>License:</Text>
            <Text style={styles.infoValue}>{order.license}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mileage:</Text>
            <Text style={styles.infoValue}>{order.mileage?.toLocaleString() || 'N/A'} miles</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Inspector:</Text>
            <Text style={styles.infoValue}>{technicianName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>
      </View>

      {/* Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Inspection Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryItem, styles.redSummary]}>
            <Text style={styles.summaryNumber}>{redItems.length}</Text>
            <Text style={styles.summaryLabel}>Immediate Attention</Text>
            <Text style={styles.summaryDesc}>Safety concerns that need immediate repair</Text>
          </View>
          <View style={[styles.summaryItem, styles.yellowSummary]}>
            <Text style={styles.summaryNumber}>{yellowItems.length}</Text>
            <Text style={styles.summaryLabel}>Monitor Closely</Text>
            <Text style={styles.summaryDesc}>Items to watch and service soon</Text>
          </View>
          <View style={[styles.summaryItem, styles.greenSummary]}>
            <Text style={styles.summaryNumber}>{greenItems.length}</Text>
            <Text style={styles.summaryLabel}>Good Condition</Text>
            <Text style={styles.summaryDesc}>Components working properly</Text>
          </View>
        </View>
      </View>

      {/* Critical Issues */}
      {redItems.length > 0 && (
        <View style={styles.issuesCard}>
          <View style={styles.criticalHeader}>
            <Text style={styles.criticalTitle}>🚨 IMMEDIATE ATTENTION REQUIRED</Text>
            <Text style={styles.criticalSubtitle}>These items affect your safety and should be addressed immediately</Text>
          </View>
          {redItems.map(item => (
            <View key={item.id} style={styles.issueItem}>
              <View style={styles.issueHeader}>
                <Text style={styles.issueName}>{item.partNumber} - {item.description}</Text>
                {item.position && <Text style={styles.issuePosition}>{item.position}</Text>}
              </View>
              <Text style={styles.issueReason}>{item.reason}</Text>
              <Text style={styles.issueRecommendation}>{getRecommendation(item)}</Text>
              {item.measurement && (
                <Text style={styles.measurement}>Measured: {item.measurement}</Text>
              )}
              {item.photo && (
                <View style={styles.photoContainer}>
                  <Text style={styles.photoLabel}>Photo Evidence:</Text>
                  <View style={styles.photoPlaceholder}>
                    <Text style={styles.photoText}>📷 Photo Available</Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Items to Monitor */}
      {yellowItems.length > 0 && (
        <View style={styles.monitorCard}>
          <Text style={styles.monitorTitle}>⚠️ ITEMS TO MONITOR</Text>
          <Text style={styles.monitorSubtitle}>These items are approaching their service limits</Text>
          {yellowItems.map(item => (
            <View key={item.id} style={styles.monitorItem}>
              <Text style={styles.monitorName}>{item.partNumber} - {item.description}</Text>
              {item.position && <Text style={styles.monitorPosition}>{item.position}</Text>}
              <Text style={styles.monitorReason}>{item.reason}</Text>
              {item.measurement && (
                <Text style={styles.measurement}>Measured: {item.measurement}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Good Items */}
      <View style={styles.goodCard}>
        <Text style={styles.goodTitle}>✅ ITEMS IN GOOD CONDITION</Text>
        <View style={styles.goodGrid}>
          {greenItems.map(item => (
            <Text key={item.id} style={styles.goodItem}>
              {item.partNumber} {item.position && `(${item.position})`}
            </Text>
          ))}
        </View>
      </View>

      {/* Technician Note */}
      <View style={styles.techNote}>
        <Text style={styles.techTitle}>From Your Technician</Text>
        <Text style={styles.techMessage}>
          "I've completed a thorough inspection of your vehicle. The items marked for immediate attention 
          are important for your safety and should be addressed as soon as possible. Please don't hesitate 
          to contact us if you have any questions about this report."
        </Text>
        <Text style={styles.techSignature}>- {technicianName}, Certified Technician</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This digital inspection was performed using professional diagnostic equipment and procedures. 
          All recommendations are based on manufacturer specifications and industry standards.
        </Text>
        <Text style={styles.footerContact}>
          Questions? Call us at (555) 123-4567 or visit us at 123 Main St
        </Text>
      </View>

      <Button title="Send Report to Customer" onPress={sendReport} style={styles.sendButton} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#007AFF',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 50,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 24,
    color: '#fff',
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  shopAddress: {
    fontSize: 14,
    color: '#666',
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#007AFF',
    letterSpacing: 1,
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoGrid: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryItem: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  redSummary: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  yellowSummary: {
    backgroundColor: '#fff8e1',
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  greenSummary: {
    backgroundColor: '#e8f5e8',
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 4,
  },
  summaryDesc: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  issuesCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 6,
    borderLeftColor: '#f44336',
  },
  criticalHeader: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  criticalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  criticalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  issueItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  issueName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  issuePosition: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  issueReason: {
    fontSize: 14,
    color: '#d32f2f',
    marginBottom: 8,
    fontWeight: '500',
  },
  issueRecommendation: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
  },
  measurement: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontFamily: 'monospace',
  },
  photoContainer: {
    marginTop: 12,
  },
  photoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  photoPlaceholder: {
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: {
    fontSize: 14,
    color: '#666',
  },
  monitorCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 6,
    borderLeftColor: '#ff9800',
  },
  monitorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f57c00',
    marginBottom: 4,
  },
  monitorSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  monitorItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  monitorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  monitorPosition: {
    fontSize: 12,
    color: '#666',
  },
  monitorReason: {
    fontSize: 13,
    color: '#f57c00',
    marginTop: 2,
  },
  goodCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 6,
    borderLeftColor: '#4caf50',
  },
  goodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#388e3c',
    marginBottom: 12,
  },
  goodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goodItem: {
    fontSize: 12,
    color: '#333',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  techNote: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 6,
    borderLeftColor: '#2196f3',
  },
  techTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  techMessage: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  techSignature: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    margin: 16,
    borderRadius: 12,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  footerContact: {
    fontSize: 12,
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  sendButton: {
    margin: 16,
    backgroundColor: '#007AFF',
  },
});