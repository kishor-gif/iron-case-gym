import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { SPACING } from '@/constants/spacing';
import { getMembers, getSettings } from '@/utils/storage';
import { formatDate } from '@/utils/date';
import { Member, Payment } from '@/types/Member';
import { Button } from '@/components/Button';
import { Linking } from 'react-native';
import { QRCode } from 'react-native-qrcode-svg';
import { Copy, ExternalLink, FileText, Check } from 'lucide-react-native';
import { Stack } from 'expo-router';

export default function PaymentsScreen() {
  const [loading, setLoading] = useState(true);
  const [recentPayments, setRecentPayments] = useState<(Payment & { memberName: string })[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [copiedText, setCopiedText] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      
      const members = await getMembers();
      const appSettings = await getSettings();
      setSettings(appSettings);
      
      // Extract all payments from all members and sort by date (most recent first)
      const allPayments: (Payment & { memberName: string })[] = [];
      
      members.forEach(member => {
        if (member.paymentHistory) {
          member.paymentHistory.forEach(payment => {
            allPayments.push({
              ...payment,
              memberName: member.name,
            });
          });
        }
      });
      
      allPayments.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
      // Take only the 10 most recent payments
      setRecentPayments(allPayments.slice(0, 10));
    } catch (error) {
      console.error('Failed to load payment data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = (text: string) => {
    setCopiedText(text);
    setCopied(true);
    
    // Reset copied state after 3 seconds
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  
  const openWhatsApp = () => {
    const whatsappNumber = settings.whatsappNumber || '+919999999999';
    const url = `whatsapp://send?phone=${whatsappNumber}&text=Hello, I need information about gym membership.`;
    
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          alert('WhatsApp is not installed on your device');
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ 
        title: 'Payments',
        headerShown: true, 
        headerStyle: { backgroundColor: COLORS.background },
        headerTitleStyle: { color: COLORS.text, fontFamily: 'Montserrat-Bold' },
        headerTintColor: COLORS.text
      }} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.qrSection}>
          <Text style={[TYPOGRAPHY.h2, styles.sectionTitle]}>Payment Options</Text>
          
          <View style={styles.qrCard}>
            <Text style={styles.qrTitle}>Scan to Pay</Text>
            
            <View style={styles.qrContainer}>
              <QRCode
                value={`upi://${settings.upiId || 'example@upi'}`}
                size={180}
                color={COLORS.text}
                backgroundColor={COLORS.card}
              />
            </View>
            
            <Text style={styles.qrCaption}>UPI ID:</Text>
            <View style={styles.upiContainer}>
              <Text style={styles.upiText}>{settings.upiId || 'example@upi'}</Text>
              <TouchableOpacity 
                style={styles.copyButton}
                onPress={() => copyToClipboard(settings.upiId || 'example@upi')}
              >
                {copied && copiedText === (settings.upiId || 'example@upi') ? (
                  <Check size={20} color={COLORS.success} />
                ) : (
                  <Copy size={20} color={COLORS.text} />
                )}
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.whatsappButton}
            onPress={openWhatsApp}
          >
            <ExternalLink size={20} color={COLORS.text} />
            <Text style={styles.whatsappText}>Contact via WhatsApp for Payment</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.recentSection}>
          <Text style={[TYPOGRAPHY.h2, styles.sectionTitle]}>Recent Payments</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : recentPayments.length > 0 ? (
            recentPayments.map((payment, index) => (
              <View key={payment.id} style={styles.paymentCard}>
                <View style={styles.paymentIconContainer}>
                  <FileText size={24} color={COLORS.text} />
                </View>
                
                <View style={styles.paymentDetails}>
                  <Text style={styles.paymentTitle}>{payment.memberName}</Text>
                  <Text style={styles.paymentDate}>{formatDate(payment.date)}</Text>
                </View>
                
                <View style={styles.paymentAmount}>
                  <Text style={styles.amountText}>₹{payment.amount}</Text>
                  <View style={[
                    styles.statusBadge, 
                    payment.status === 'completed' ? styles.completedBadge : 
                    payment.status === 'pending' ? styles.pendingBadge : 
                    styles.failedBadge
                  ]}>
                    <Text style={styles.statusText}>{payment.status}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No payment records found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  qrSection: {
    marginBottom: SPACING.xl,
  },
  qrCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  qrTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.md,
  },
  qrContainer: {
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
  },
  qrCaption: {
    ...TYPOGRAPHY.small,
    color: COLORS.textTertiary,
  },
  upiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  upiText: {
    ...TYPOGRAPHY.subtitle,
    marginRight: SPACING.sm,
  },
  copyButton: {
    padding: 4,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    borderRadius: 8,
    paddingVertical: SPACING.md,
    marginTop: SPACING.md,
  },
  whatsappText: {
    ...TYPOGRAPHY.button,
    marginLeft: SPACING.sm,
  },
  recentSection: {
    marginBottom: SPACING.lg,
  },
  loadingContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  paymentCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentTitle: {
    ...TYPOGRAPHY.bodyBold,
  },
  paymentDate: {
    ...TYPOGRAPHY.small,
    color: COLORS.textTertiary,
  },
  paymentAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  completedBadge: {
    backgroundColor: COLORS.success + '33',
  },
  pendingBadge: {
    backgroundColor: COLORS.warning + '33',
  },
  failedBadge: {
    backgroundColor: COLORS.error + '33',
  },
  statusText: {
    ...TYPOGRAPHY.small,
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  emptyState: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
});