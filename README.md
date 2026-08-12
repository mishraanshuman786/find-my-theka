# Find My Theka - React Native App

A React Native Expo mobile application to find nearby liquor shops (thekas) using Mappls (MapmyIndia) API.

## Features

- **User Authentication** - Register and login with JWT
- **Location Services** - GPS-based location detection
- **Interactive Map** - View nearby liquor shops on a map
- **Place Details** - View shop details, distance, and directions
- **Search History** - Track your recent searches
- **Profile Management** - Manage your account

## Tech Stack

- **React Native** with Expo
- **React Navigation** - Stack navigation
- **react-native-maps** - Map display
- **expo-location** - GPS location
- **AsyncStorage** - Local token storage
- **Axios** - HTTP client

## Project Structure

```
find-my-theka-app/
├── App.js                    # Main app entry
├── app.json                  # Expo configuration
├── babel.config.js           # Babel configuration
├── .env                      # Environment variables
├── src/
│   ├── api/
│   │   └── client.js         # API client with axios
│   ├── context/
│   │   └── AuthContext.js    # Authentication context
│   ├── constants/
│   │   └── colors.js         # Color palette
│   ├── navigation/
│   │   └── AppNavigator.js   # Navigation setup
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── HomeScreen.js      # Map view
│   │   ├── PlaceDetailScreen.js
│   │   ├── SearchHistoryScreen.js
│   │   ├── ProfileScreen.js
│   │   └── LoadingScreen.js
│   └── components/
│       └── PlaceCard.js       # Place list card
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure the backend API URL in `src/api/client.js`:
```javascript
// For Android emulator
const API_BASE_URL = 'http://10.0.2.2:3001/api';

// For iOS simulator
const API_BASE_URL = 'http://localhost:3001/api';

// For physical device (use your computer's IP)
const API_BASE_URL = 'http://192.168.1.x:3001/api';
```

3. Start the Expo development server:
```bash
npx expo start
```

4. Run on device:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app on physical device

## Screenshots Flow

1. **Login** → Enter email/password → Dashboard
2. **Register** → Create account → Dashboard
3. **Home** → View map with markers → Tap marker for details
4. **Place Detail** → View shop info → Open in Maps
5. **Profile** → View account → Logout

## Permissions Required

### Android
- `ACCESS_FINE_LOCATION`
- `ACCESS_COARSE_LOCATION`
- `ACCESS_BACKGROUND_LOCATION`

### iOS
- `NSLocationWhenInUseUsageDescription`
- `NSLocationAlwaysUsageDescription`

## Backend Configuration

Make sure the Express backend is running before starting the app:

```bash
cd ../find-my-theka-backend
npm run dev
```

## Troubleshooting

### Location not working on Android Emulator
- Use `10.0.2.2` as the backend host (not `localhost`)
- Enable location in emulator settings

### Maps not showing
- Ensure `react-native-maps` is properly installed
- For Android, add Google Maps API key in `app.json`

### API connection refused
- Check that the backend server is running
- Verify the correct IP address in `src/api/client.js`
- For physical devices, use your computer's local network IP

## License

MIT
