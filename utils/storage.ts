import * as FileSystem from 'expo-file-system';
import { Member } from '@/types/Member';

// Define base directory for app data
const BASE_DIR = `${FileSystem.documentDirectory}ironCaseGym/`;
const MEMBERS_FILE = `${BASE_DIR}members.json`;
const SETTINGS_FILE = `${BASE_DIR}settings.json`;

// Ensure base directory exists
const setupStorage = async () => {
  const dirInfo = await FileSystem.getInfoAsync(BASE_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(BASE_DIR, { intermediates: true });
  }
};

// Initialize files if they don't exist
const initializeFiles = async () => {
  await setupStorage();
  
  // Check and create members file
  const membersInfo = await FileSystem.getInfoAsync(MEMBERS_FILE);
  if (!membersInfo.exists) {
    await FileSystem.writeAsStringAsync(MEMBERS_FILE, JSON.stringify([]));
  }
  
  // Check and create settings file
  const settingsInfo = await FileSystem.getInfoAsync(SETTINGS_FILE);
  if (!settingsInfo.exists) {
    const defaultSettings = {
      upiId: 'example@upi',
      whatsappNumber: '+919999999999',
      gymName: 'Iron Case Gym',
      address: 'Add your gym address here',
      notificationsEnabled: true,
    };
    await FileSystem.writeAsStringAsync(SETTINGS_FILE, JSON.stringify(defaultSettings));
  }
};

// Get all members
export const getMembers = async (): Promise<Member[]> => {
  await initializeFiles();
  const content = await FileSystem.readAsStringAsync(MEMBERS_FILE);
  return JSON.parse(content);
};

// Get member by ID
export const getMemberById = async (id: string): Promise<Member | null> => {
  const members = await getMembers();
  return members.find(member => member.id === id) || null;
};

// Add a new member
export const addMember = async (member: Member): Promise<void> => {
  const members = await getMembers();
  members.push(member);
  await FileSystem.writeAsStringAsync(MEMBERS_FILE, JSON.stringify(members));
};

// Update an existing member
export const updateMember = async (updatedMember: Member): Promise<void> => {
  const members = await getMembers();
  const index = members.findIndex(m => m.id === updatedMember.id);
  if (index !== -1) {
    members[index] = updatedMember;
    await FileSystem.writeAsStringAsync(MEMBERS_FILE, JSON.stringify(members));
  }
};

// Delete a member
export const deleteMember = async (id: string): Promise<void> => {
  const members = await getMembers();
  const filtered = members.filter(member => member.id !== id);
  await FileSystem.writeAsStringAsync(MEMBERS_FILE, JSON.stringify(filtered));
};

// Get app settings
export const getSettings = async (): Promise<any> => {
  await initializeFiles();
  const content = await FileSystem.readAsStringAsync(SETTINGS_FILE);
  return JSON.parse(content);
};

// Update app settings
export const updateSettings = async (settings: any): Promise<void> => {
  await initializeFiles();
  await FileSystem.writeAsStringAsync(SETTINGS_FILE, JSON.stringify(settings));
};

// Save photo
export const savePhoto = async (uri: string, memberId: string): Promise<string> => {
  await setupStorage();
  const photoDir = `${BASE_DIR}photos/`;
  const dirInfo = await FileSystem.getInfoAsync(photoDir);
  
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(photoDir, { intermediates: true });
  }
  
  const fileName = `member_${memberId}_${Date.now()}.jpg`;
  const destination = `${photoDir}${fileName}`;
  
  await FileSystem.copyAsync({
    from: uri,
    to: destination
  });
  
  return destination;
};