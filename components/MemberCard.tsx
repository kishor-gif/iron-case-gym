import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Member } from '@/types/Member';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { SPACING } from '@/constants/spacing';
import { formatDate, daysRemaining, isExpired } from '@/utils/date';
import { Phone } from 'lucide-react-native';

interface MemberCardProps {
  member: Member;
  onPress: () => void;
  onCallPress?: () => void;
}

export const MemberCard = ({ member, onPress, onCallPress }: MemberCardProps) => {
  const daysLeft = daysRemaining(member.expiryDate);
  const expired = isExpired(member.expiryDate);
  
  // Determine status color
  const getStatusColor = () => {
    if (expired) return COLORS.error;
    if (daysLeft <= 5) return COLORS.warning;
    return COLORS.success;
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.topRow}>
        <View style={styles.photoContainer}>
          {member.photo ? (
            <Image source={{ uri: member.photo }} style={styles.photo} />
          ) : (
            <View style={[styles.photo, styles.placeholderPhoto]}>
              <Text style={styles.placeholderText}>
                {member.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.detailsContainer}>
          <Text style={TYPOGRAPHY.subtitle}>{member.name}</Text>
          <Text style={TYPOGRAPHY.caption}>{member.membershipType}</Text>
          
          <View style={styles.statusRow}>
            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
            <Text style={styles.statusText}>
              {expired 
                ? 'Expired' 
                : daysLeft === 0 
                  ? 'Expires today' 
                  : `${daysLeft} days left`}
            </Text>
          </View>
        </View>
        
        {onCallPress && (
          <TouchableOpacity 
            style={styles.phoneButton}
            onPress={onCallPress}
          >
            <Phone size={24} color={COLORS.text} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.bottomRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Joined</Text>
          <Text style={styles.infoValue}>{formatDate(member.joinDate)}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Expiry</Text>
          <Text style={styles.infoValue}>{formatDate(member.expiryDate)}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Status</Text>
          <View style={[styles.paymentStatus, styles[`${member.paymentStatus}Status`]]}>
            <Text style={styles.paymentStatusText}>
              {member.paymentStatus.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  photoContainer: {
    marginRight: SPACING.md,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  placeholderPhoto: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  statusText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },
  phoneButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.textTertiary,
    marginBottom: 2,
  },
  infoValue: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  paymentStatus: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  paidStatus: {
    backgroundColor: COLORS.success + '33', // Adding alpha for transparency
  },
  pendingStatus: {
    backgroundColor: COLORS.warning + '33',
  },
  overdueStatus: {
    backgroundColor: COLORS.error + '33',
  },
  paymentStatusText: {
    ...TYPOGRAPHY.small,
    fontSize: 10,
    fontWeight: 'bold',
  },
});