import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { SPACING } from '@/constants/spacing';
import { Check } from 'lucide-react-native';

interface MembershipPlanCardProps {
  id: string;
  title: string;
  price: number;
  duration: number;
  features: string[];
  selected?: boolean;
  onSelect: (id: string) => void;
}

export const MembershipPlanCard = ({
  id,
  title,
  price,
  duration,
  features,
  selected = false,
  onSelect,
}: MembershipPlanCardProps) => {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={() => onSelect(id)}
      activeOpacity={0.7}
    >
      <View style={styles.topSection}>
        <Text style={[TYPOGRAPHY.h3, styles.title]}>{title}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.currency}>₹</Text>
          <Text style={styles.price}>{price}</Text>
        </View>
        <Text style={styles.duration}>
          {duration} {duration === 1 ? 'month' : 'months'}
        </Text>
      </View>

      <View style={styles.featuresSection}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Check size={16} color={COLORS.success} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <View style={styles.selectContainer}>
        <View
          style={[
            styles.radioButton,
            selected && styles.radioButtonSelected,
          ]}
        >
          {selected && <View style={styles.radioInner} />}
        </View>
        <Text style={styles.selectText}>
          {selected ? 'Selected' : 'Select Plan'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    marginBottom: SPACING.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  currency: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginTop: 5,
  },
  price: {
    ...TYPOGRAPHY.h1,
    fontSize: 36,
    color: COLORS.text,
  },
  duration: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  featuresSection: {
    marginBottom: SPACING.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  featureText: {
    ...TYPOGRAPHY.body,
    marginLeft: SPACING.sm,
    color: COLORS.textSecondary,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  selectText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary,
  },
});