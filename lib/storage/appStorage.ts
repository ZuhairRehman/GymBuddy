import * as SecureStore from 'expo-secure-store';

const APP_LAUNCHED_KEY = 'app_launched';

export const AppStorage = {
  isFirstLaunch: async () => {
    const hasLaunched = await SecureStore.getItemAsync(APP_LAUNCHED_KEY);
    return hasLaunched === null;
  },

  setAppLaunched: async () => {
    await SecureStore.setItemAsync(APP_LAUNCHED_KEY, 'true');
  },
};
