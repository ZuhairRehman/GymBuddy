// Import necessary modules
import { Redirect } from 'expo-router';

// TabIndex component redirects users to the login screen
export default function TabIndex() {
  return <Redirect href={'/(auth)/login/'} />;
}
