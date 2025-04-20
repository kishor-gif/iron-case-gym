import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Button } from '@/components/Button';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { SPACING } from '@/constants/spacing';
import { MEMBERSHIP_PLANS } from '@/constants/membershipPlans';
import { Member } from '@/types/Member';
import { addMember, savePhoto, updateSettings } from '@/utils/storage';
import { addMonths, getCurrentDate } from '@/utils/date';
import { schedulePaymentReminder } from '@/utils/notifications';
import { Camera, X, Upload } from 'lucide-react-native';
import { MembershipPlanCard } from '@/components/MembershipPlanCard';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, CameraType } from 'expo-camera';

export default function RegisterScreen() {
  const router = useRouter();
  
  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [selectedPlan, setSelectedPlan] = useState(MEMBERSHIP_PLANS[0].id);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  
  // Camera state
  const [showCamera, setShowCamera] = useState(false);
  const [cameraType, setCameraType] = useState<CameraType>('front');
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [cameraRef, setCameraRef] = useState<any>(null);
  
  // Loading state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (phone.trim() && phone.length !== 10) newErrors.phone = 'Enter a valid 10-digit phone number';
    if (email && !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email address';
    if (age && (isNaN(Number(age)) || Number(age) <= 0)) newErrors.age = 'Enter a valid age';
    if (height && (isNaN(Number(height)) || Number(height) <= 0)) newErrors.height = 'Enter a valid height';
    if (weight && (isNaN(Number(weight)) || Number(weight) <= 0)) newErrors.weight = 'Enter a valid weight';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Find selected plan
      const plan = MEMBERSHIP_PLANS.find(p => p.id === selectedPlan) || MEMBERSHIP_PLANS[0];
      
      // Generate member ID
      const memberId = Date.now().toString();
      
      // Save photo if exists
      let finalPhotoUri = photoUri;
      if (photoUri) {
        finalPhotoUri = await savePhoto(photoUri, memberId);
      }
      
      // Current date
      const joinDate = getCurrentDate();
      
      // Calculate expiry date based on plan duration
      const expiryDate = addMonths(joinDate, plan.durationMonths);
      
      // Create member object
      const newMember: Member = {
        id: memberId,
        name,
        phone,
        email: email || undefined,
        joinDate,
        expiryDate,
        membershipType: plan.name,
        paymentStatus: 'paid',
        photo: finalPhotoUri || '',
        age: age ? parseInt(age) : undefined,
        height: height ? parseInt(height) : undefined,
        weight: weight ? parseInt(weight) : undefined,
        gender,
        workoutHistory: [],
        paymentHistory: [{
          id: Date.now().toString(),
          date: joinDate,
          amount: plan.price,
          method: 'cash',
          status: 'completed'
        }]
      };
      
      // Save member
      await addMember(newMember);
      
      // Schedule payment reminders
      await schedulePaymentReminder(newMember);
      
      // Navigate back to members list
      router.replace('/members');
    } catch (error) {
      console.error('Failed to register member:', error);
      alert('Failed to register member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    setCameraPermission(status === 'granted');
    if (status === 'granted') {
      setShowCamera(true);
    } else {
      alert('Camera permission is required to take photos');
    }
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const { uri } = await cameraRef.takePictureAsync({
          quality: 0.8,
        });
        setPhotoUri(uri);
        setShowCamera(false);
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ 
        title: 'Register New Member',
        headerShown: true, 
        headerStyle: { backgroundColor: COLORS.background },
        headerTitleStyle: { color: COLORS.text, fontFamily: 'Montserrat-Bold' },
        headerTintColor: COLORS.text
      }} />
      
      {showCamera ? (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing={cameraType}
            ref={(ref) => setCameraRef(ref)}
          >
            <View style={styles.cameraControls}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowCamera(false)}
              >
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.captureButton}
                onPress={takePicture}
              />
              
              <TouchableOpacity 
                style={styles.flipButton}
                onPress={() => setCameraType(current => current === 'front' ? 'back' : 'front')}
              >
                <Camera size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.photoSection}>
            <View style={styles.photoContainer}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.photo} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.photoPlaceholderText}>
                    {name ? name.charAt(0).toUpperCase() : '?'}
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.photoButtons}>
              <Button 
                title="Camera" 
                onPress={requestCameraPermission} 
                variant="secondary"
                icon={<Camera size={18} color={COLORS.text} />}
              />
              <Button 
                title="Gallery" 
                onPress={pickImage} 
                variant="outline"
                icon={<Upload size={18} color={COLORS.primary} />}
              />
            </View>
          </View>
          
          <Text style={[TYPOGRAPHY.h3, styles.sectionTitle]}>Personal Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter full name"
              placeholderTextColor={COLORS.textTertiary}
              value={name}
              onChangeText={setName}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 10-digit phone number"
              placeholderTextColor={COLORS.textTertiary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email address"
              placeholderTextColor={COLORS.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>
          
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: SPACING.md }]}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                placeholder="Years"
                placeholderTextColor={COLORS.textTertiary}
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
              />
              {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
            </View>
            
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    gender === 'male' && styles.selectedGender,
                  ]}
                  onPress={() => setGender('male')}
                >
                  <Text style={[
                    styles.genderText,
                    gender === 'male' && styles.selectedGenderText,
                  ]}>Male</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    gender === 'female' && styles.selectedGender,
                  ]}
                  onPress={() => setGender('female')}
                >
                  <Text style={[
                    styles.genderText,
                    gender === 'female' && styles.selectedGenderText,
                  ]}>Female</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    gender === 'other' && styles.selectedGender,
                  ]}
                  onPress={() => setGender('other')}
                >
                  <Text style={[
                    styles.genderText,
                    gender === 'other' && styles.selectedGenderText,
                  ]}>Other</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: SPACING.md }]}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="In cm"
                placeholderTextColor={COLORS.textTertiary}
                value={height}
                onChangeText={setHeight}
                keyboardType="number-pad"
              />
              {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}
            </View>
            
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="In kg"
                placeholderTextColor={COLORS.textTertiary}
                value={weight}
                onChangeText={setWeight}
                keyboardType="number-pad"
              />
              {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
            </View>
          </View>
          
          <Text style={[TYPOGRAPHY.h3, styles.sectionTitle]}>Select Membership Plan</Text>
          
          {MEMBERSHIP_PLANS.map((plan) => (
            <MembershipPlanCard
              key={plan.id}
              id={plan.id}
              title={plan.name}
              price={plan.price}
              duration={plan.durationMonths}
              features={plan.features}
              selected={selectedPlan === plan.id}
              onSelect={(id) => setSelectedPlan(id)}
            />
          ))}
          
          <Button
            title="Register Member"
            onPress={handleRegister}
            loading={loading}
            fullWidth
          />
        </ScrollView>
      )}
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
  photoSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  photoContainer: {
    marginBottom: SPACING.md,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary + '40',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  photoPlaceholderText: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
  },
  photoButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.md,
    color: COLORS.text,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
  },
  errorText: {
    color: COLORS.error,
    ...TYPOGRAPHY.small,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    overflow: 'hidden',
  },
  genderOption: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedGender: {
    backgroundColor: COLORS.primary,
  },
  genderText: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  selectedGenderText: {
    color: COLORS.text,
    fontFamily: 'Montserrat-Bold',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.text,
    borderWidth: 5,
    borderColor: 'rgba(0,0,0,0.3)',
  },
  flipButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});