import { Stack } from 'expo-router';

export default function RegisterOwnerLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='personal-info' />
            <Stack.Screen name='gym-details' />
            <Stack.Screen name='gym-facilities' />
            <Stack.Screen name='gym-pricing' />
            <Stack.Screen name='gym-capacity' />
        </Stack>
    );
}
