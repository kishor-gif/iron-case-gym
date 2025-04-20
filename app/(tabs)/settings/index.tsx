import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { SPACING } from '@/constants/spacing';
import { getSettings, updateSettings } from '@/utils/storage';
import { cancelAllNotifications, configureNotifications } from '@/utils/notifications';
import { Button } from '@/components/Button';
import { Bell, User, Shield, CreditCard, CircleHelp as HelpCircle, BookOpen, CreditCard as Edit, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>({});
  const [editingUpi, setEditingUpi] = useState(false);
  const [upiValue, setUpiValue] = useState('');
  const [editingWhatsapp, setEditingWhatsapp] = useState(false);
  const [whatsappValue, setWhatsappValue] = useState('');
  
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    try {
      setLoading(true);
      const savedSettings = await getSettings();
      setSettings(savedSettings);
      setUpiValue(savedSettings.upiId || '');
      setWhatsappValue(savedSettings.whatsappNumber || '');
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleNotifications = async (value: boolean) => {
    try {
      const newSettings = { ...settings, notificationsEnabled: value };
      setSettings(newSettings);
      await updateSettings(newSettings);
      
      if (value) {
        await configureNotifications();
      } else {
        await cancelAllNotifications();
      }
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      Alert.alert('Error', 'Failed to update notification settings');
    }
  };
  
  const saveUpi = async () => {
    try {
      if (!upiValue.trim()) {
        Alert.alert('Error', 'UPI ID cannot be empty');
        return;
      }
      
      const newSettings = { ...settings, upiId: upiValue };
      setSettings(newSettings);
      await updateSettings(newSettings);
      setEditingUpi(false);
    } catch (error) {
      console.error('Failed to save UPI ID:', error);
      Alert.alert('Error', 'Failed to save UPI ID');
    }
  };
  
  const saveWhatsapp = async () => {
    try {
      if (!whatsappValue.trim()) {
        Alert.alert('Error', 'WhatsApp number cannot be empty');
        return;
      }
      
      const newSettings = { ...settings, whatsappNumber: whatsappValue };
      setSettings(newSettings);
      await updateSettings(newSettings);
      setEditingWhatsapp(false);
    } catch (error) {
      console.error('Failed to save WhatsApp number:', error);
      Alert.alert('Error', 'Failed to save WhatsApp number');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={TYPOGRAPHY.h1}>Settings</Text>
          <Text style={styles.subtitle}>Manage app preferences</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <CreditCard size={24} color={COLORS.text} style={styles.settingIcon} />
              <View>
                <Text style={styles.settingLabel}>UPI ID</Text>
                {editingUpi ? (
                  <TextInput
                    style={styles.input}
                    value={upiValue}
                    onChangeText={setUpiValue}
                    placeholder="Enter UPI ID"
                    placeholderTextColor={COLORS.textTertiary}
                    autoCapitalize="none"
                  />
                ) : (
                  <Text style={styles.settingValue}>{settings.upiId || 'Not set'}</Text>
                )}
              </View>
            </View>
            
            {editingUpi ? (
              <Button
                title="Save"
                onPress={saveUpi}
                variant="secondary"
              />
            ) : (
              <TouchableOpacity onPress={() => setEditingUpi(true)}>
                <Edit size={20} color={COLORS.primary} />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Bell size={24} color={COLORS.text} style={styles.settingIcon} />
              <View>
                <Text style={styles.settingLabel}>WhatsApp Number</Text>
                {editingWhatsapp ? (
                  <TextInput
                    style={styles.input}
                    value={whatsappValue}
                    onChangeText={setWhatsappValue}
                    placeholder="Enter WhatsApp number with country code"
                    placeholderTextColor={COLORS.textTertiary}
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.settingValue}>{settings.whatsappNumber || 'Not set'}</Text>
                )}
              </View>
            </View>
            
            {editingWhatsapp ? (
              <Button
                title="Save"
                onPress={saveWhatsapp}
                variant="secondary"
              />
            ) : (
              <TouchableOpacity onPress={() => setEditingWhatsapp(true)}>
                <Edit size={20} color={COLORS.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Bell size={24} color={COLORS.text} style={styles.settingIcon} />
              <View>
                <Text style={styles.settingLabel}>Payment Reminders</Text>
                <Text style={styles.settingDescription}>
                  Send notifications when memberships are about to expire
                </Text>
              </View>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: COLORS.darkGray, true: COLORS.primary + '80' }}
              thumbColor={settings.notificationsEnabled ? COLORS.primary : COLORS.gray}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Settings</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <User size={20} color={COLORS.text} style={styles.menuIcon} />
              <Text style={styles.menuText}>Account</Text>
            </View>
            <ChevronRight size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Shield size={20} color={COLORS.text} style={styles.menuIcon} />
              <Text style={styles.menuText}>Privacy & Security</Text>
            </View>
            <ChevronRight size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <HelpCircle size={20} color={COLORS.text} style={styles.menuIcon} />
              <Text style={styles.menuText}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <BookOpen size={20} color={COLORS.text} style={styles.menuIcon} />
              <Text style={styles.menuText}>Terms & Conditions</Text>
            </View>
            <ChevronRight size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Iron Case Gym v1.0.0</Text>
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
  header: {
    marginBottom: SPACING.lg,
  },
  subtitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: SPACING.md,
  },
  settingLabel: {
    ...TYPOGRAPHY.body,
  },
  settingDescription: {
    ...TYPOGRAPHY.small,
    color: COLORS.textTertiary,
  },
  settingValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    padding: SPACING.sm,
    color: COLORS.text,
    minWidth: 200,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: SPACING.md,
  },
  menuText: {
    ...TYPOGRAPHY.body,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  versionText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textTertiary,
  },
});