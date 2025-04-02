// Import the Slot component from expo-router to render child routes
import { Slot } from 'expo-router';

// TabIndex Component
// This component acts as a placeholder for rendering child routes dynamically.
// It allows nested routes to be displayed within this layout.
export default function TabIndex() {
  return <Slot />;
}
