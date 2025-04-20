import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { SPACING } from '@/constants/spacing';
import { useRouter } from 'expo-router';
import { Dumbbell, Scale, Syringe, Flame, Clock, Heart } from 'lucide-react-native';

// Define workout categories
const workoutCategories = [
  {
    id: 'chest',
    name: 'Chest',
    image: 'https://images.pexels.com/photos/4162487/pexels-photo-4162487.jpeg',
    exercises: 12,
  },
  {
    id: 'back',
    name: 'Back',
    image: 'https://images.pexels.com/photos/4162438/pexels-photo-4162438.jpeg',
    exercises: 15,
  },
  {
    id: 'arms',
    name: 'Arms',
    image: 'https://images.pexels.com/photos/4162505/pexels-photo-4162505.jpeg',
    exercises: 14,
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    image: 'https://images.pexels.com/photos/6295878/pexels-photo-6295878.jpeg',
    exercises: 10,
  },
  {
    id: 'legs',
    name: 'Legs',
    image: 'https://images.pexels.com/photos/6550857/pexels-photo-6550857.jpeg',
    exercises: 13,
  },
  {
    id: 'core',
    name: 'Core',
    image: 'https://images.pexels.com/photos/1865131/pexels-photo-1865131.jpeg',
    exercises: 16,
  },
];

// Define features
const features = [
  {
    id: 'bmr',
    name: 'BMR Calculator',
    description: 'Calculate your daily calorie needs',
    icon: <Scale size={24} color={COLORS.text} />,
    color: COLORS.primary,
  },
  {
    id: 'diet',
    name: 'Diet Plans',
    description: 'Custom nutrition for your goals',
    icon: <Syringe size={24} color={COLORS.text} />,
    color: COLORS.secondary,
  },
  {
    id: 'cardio',
    name: 'Cardio Sessions',
    description: 'HIIT and steady state options',
    icon: <Flame size={24} color={COLORS.text} />,
    color: COLORS.error,
  },
  {
    id: 'tracker',
    name: 'Workout Tracker',
    description: 'Monitor your weekly progress',
    icon: <Clock size={24} color={COLORS.text} />,
    color: COLORS.success,
  },
];

export default function WorkoutsScreen() {
  const router = useRouter();
  
  const navigateToCategory = (categoryId: string) => {
    // Will implement in future
    console.log(`Navigate to category: ${categoryId}`);
  };
  
  const navigateToFeature = (featureId: string) => {
    // Will implement in future
    console.log(`Navigate to feature: ${featureId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={TYPOGRAPHY.h1}>Workouts</Text>
          <Text style={styles.subtitle}>Find exercises and track progress</Text>
        </View>
        
        <View style={styles.featuresContainer}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={[styles.featureCard, { backgroundColor: feature.color + '20' }]}
              onPress={() => navigateToFeature(feature.id)}
            >
              <View style={[styles.featureIconContainer, { backgroundColor: feature.color }]}>
                {feature.icon}
              </View>
              <Text style={styles.featureName}>{feature.name}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={[TYPOGRAPHY.h2, styles.sectionTitle]}>Exercise Categories</Text>
        
        <View style={styles.categoriesContainer}>
          {workoutCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => navigateToCategory(category.id)}
            >
              <Image
                source={{ uri: category.image }}
                style={styles.categoryImage}
              />
              <View style={styles.categoryOverlay} />
              <View style={styles.categoryContent}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <View style={styles.exerciseCount}>
                  <Dumbbell size={14} color={COLORS.text} />
                  <Text style={styles.exerciseCountText}>
                    {category.exercises} exercises
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.quickStartSection}>
          <Text style={[TYPOGRAPHY.h2, styles.sectionTitle]}>Quick Start</Text>
          
          <TouchableOpacity style={styles.quickStartCard}>
            <View style={styles.quickStartIconContainer}>
              <Heart size={24} color={COLORS.text} />
            </View>
            <View style={styles.quickStartContent}>
              <Text style={styles.quickStartTitle}>Today's Workout</Text>
              <Text style={styles.quickStartDescription}>
                Chest & Triceps • 8 exercises
              </Text>
            </View>
            <View style={styles.startButton}>
              <Text style={styles.startButtonText}>START</Text>
            </View>
          </TouchableOpacity>
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
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  featureCard: {
    width: '48%',
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  featureName: {
    ...TYPOGRAPHY.subtitle,
    fontSize: 16,
    marginBottom: 4,
  },
  featureDescription: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  categoryCard: {
    width: '48%',
    height: 160,
    borderRadius: 16,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  categoryContent: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
  },
  categoryName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: 4,
  },
  exerciseCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseCountText: {
    ...TYPOGRAPHY.small,
    color: COLORS.text,
    marginLeft: 4,
  },
  quickStartSection: {
    marginBottom: SPACING.lg,
  },
  quickStartCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickStartIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  quickStartContent: {
    flex: 1,
  },
  quickStartTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
  },
  quickStartDescription: {
    ...TYPOGRAPHY.small,
    color: COLORS.text + 'CC',
  },
  startButton: {
    backgroundColor: COLORS.text,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  startButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.primary,
    fontSize: 14,
  },
});