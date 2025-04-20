import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { SPACING } from '@/constants/spacing';
import { getMembers } from '@/utils/storage';
import { Member } from '@/types/Member';
import { MemberCard } from '@/components/MemberCard';
import { Users, TrendingUp, CreditCard, ChartBar as BarChart3 } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [expiringMembers, setExpiringMembers] = useState<Member[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const allMembers = await getMembers();
      setMembers(allMembers);

      // Filter members expiring in the next 7 days
      const currentDate = new Date();
      const sevenDaysLater = new Date();
      sevenDaysLater.setDate(currentDate.getDate() + 7);

      const expiring = allMembers.filter(member => {
        const expiryDate = new Date(member.expiryDate);
        return expiryDate >= currentDate && expiryDate <= sevenDaysLater;
      });

      setExpiringMembers(expiring);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToMember = (memberId: string) => {
    router.push(`/members/details?id=${memberId}`);
  };

  const goToWhatsApp = (phone: string) => {
    // Implement WhatsApp deep linking
    console.log('Open WhatsApp for', phone);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={TYPOGRAPHY.h1}>Iron Case Gym</Text>
          <Text style={styles.subtitle}>Dashboard</Text>
        </View>

        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: COLORS.primary + '20' }]}
            onPress={() => router.push('/members')}
          >
            <View style={[styles.iconContainer, { backgroundColor: COLORS.primary }]}>
              <Users size={24} color="#fff" />
            </View>
            <Text style={styles.statValue}>{members.length}</Text>
            <Text style={styles.statLabel}>Active Members</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: COLORS.secondary + '20' }]}
            onPress={() => router.push('/workouts')}
          >
            <View style={[styles.iconContainer, { backgroundColor: COLORS.secondary }]}>
              <TrendingUp size={24} color="#fff" />
            </View>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Workouts Today</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: COLORS.success + '20' }]}
            onPress={() => router.push('/payments')}
          >
            <View style={[styles.iconContainer, { backgroundColor: COLORS.success }]}>
              <CreditCard size={24} color="#fff" />
            </View>
            <Text style={styles.statValue}>₹8.5K</Text>
            <Text style={styles.statLabel}>Monthly Revenue</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: COLORS.accent + '20' }]}
            onPress={() => router.push('/settings')}
          >
            <View style={[styles.iconContainer, { backgroundColor: COLORS.accent }]}>
              <BarChart3 size={24} color="#fff" />
            </View>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Attendance Rate</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={TYPOGRAPHY.h2}>Memberships Expiring Soon</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : expiringMembers.length > 0 ? (
          expiringMembers.map(member => (
            <MemberCard
              key={member.id}
              member={member}
              onPress={() => navigateToMember(member.id)}
              onCallPress={() => goToWhatsApp(member.phone)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No memberships expiring soon</Text>
          </View>
        )}
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
  },
  header: {
    marginBottom: SPACING.lg,
  },
  subtitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  statCard: {
    width: '48%',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statValue: {
    ...TYPOGRAPHY.h2,
    marginBottom: 4,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
  },
  sectionHeader: {
    marginBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.sm,
  },
  loadingContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyState: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 8,
    marginBottom: SPACING.lg,
  },
  emptyStateText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
});