import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { TYPOGRAPHY } from '@/constants/typography';
import { SPACING } from '@/constants/spacing';
import { getMembers } from '@/utils/storage';
import { Member } from '@/types/Member';
import { MemberCard } from '@/components/MemberCard';
import { Search, UserPlus, ArrowDownUp, X } from 'lucide-react-native';
import { Button } from '@/components/Button';

export default function MembersScreen() {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'name' | 'expiryDate'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const router = useRouter();

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    filterAndSortMembers();
  }, [searchQuery, members, sortOption, sortDirection]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const allMembers = await getMembers();
      setMembers(allMembers);
      setFilteredMembers(allMembers);
    } catch (error) {
      console.error('Failed to load members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortMembers = () => {
    // First filter by search query
    let result = [...members];
    if (searchQuery) {
      result = result.filter(member => 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        member.phone.includes(searchQuery)
      );
    }
    
    // Then sort
    result.sort((a, b) => {
      // Sort by name
      if (sortOption === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      
      // Sort by expiry date
      const dateA = new Date(a.expiryDate).getTime();
      const dateB = new Date(b.expiryDate).getTime();
      
      return sortDirection === 'asc'
        ? dateA - dateB
        : dateB - dateA;
    });
    
    setFilteredMembers(result);
  };

  const toggleSort = () => {
    if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else {
      // If already desc, switch sort option and reset to asc
      setSortOption(sortOption === 'name' ? 'expiryDate' : 'name');
      setSortDirection('asc');
    }
  };

  const navigateToMemberDetails = (id: string) => {
    router.push(`/members/details?id=${id}`);
  };

  const handleAddMember = () => {
    router.push('/members/register');
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderMemberItem = ({ item }: { item: Member }) => (
    <MemberCard
      member={item}
      onPress={() => navigateToMemberDetails(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={TYPOGRAPHY.h1}>Members</Text>
        <Button 
          title="Add New" 
          onPress={handleAddMember} 
          icon={<UserPlus size={20} color={COLORS.text} />}
        />
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or phone..."
            placeholderTextColor={COLORS.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity style={styles.sortButton} onPress={toggleSort}>
          <ArrowDownUp size={20} color={COLORS.text} />
          <Text style={styles.sortText}>
            {sortOption === 'name' ? 'Name' : 'Expiry'} ({sortDirection === 'asc' ? '↑' : '↓'})
          </Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : filteredMembers.length > 0 ? (
        <FlatList
          data={filteredMembers}
          renderItem={renderMemberItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery ? 'No members match your search' : 'No members added yet'}
          </Text>
          {searchQuery ? (
            <Button title="Clear Search" onPress={clearSearch} variant="outline" />
          ) : (
            <Button title="Add Member" onPress={handleAddMember} />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: COLORS.text,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  sortText: {
    ...TYPOGRAPHY.caption,
    marginLeft: SPACING.xs,
  },
  listContent: {
    padding: SPACING.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
});