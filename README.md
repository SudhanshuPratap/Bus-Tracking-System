# BusTracker App

A React Native bus tracking application prototype with real-time bus information and route management.

## Features

### 🚀 Launch Screen
- Animated splash screen with app branding
- Smooth transitions and loading indicators
- Auto-navigation to route selection

### 🗺️ Route Selection Screen  
- Browse available bus routes
- Search functionality for routes
- Interactive route selection
- Modern card-based UI design

### 🚌 Bus Tracking Screen
- Real-time bus location tracking
- Arrival time predictions with delay information
- Bus capacity indicators
- Detailed bus information modal
- Next stops display
- Driver information
- Refresh functionality for live updates

## Technical Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6
- **UI Components**: Custom styled components
- **Animations**: React Native Animated API
- **Gradients**: Expo Linear Gradient

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on your device:
   - Install Expo Go app on your mobile device
   - Scan the QR code displayed in terminal
   - Or run on simulator: `npm run ios` or `npm run android`

## App Flow

1. **Launch Screen** → Auto-navigates after 3 seconds
2. **Route Selection** → User selects route and taps "Track Bus"
3. **Bus Tracking** → Real-time bus information with details modal

## Mock Data

The app currently uses mock data for demonstration:
- Sample bus routes (101-105, Express 201-202)
- Simulated real-time bus locations
- Mock arrival times and delay information
- Sample driver and capacity data

## Future Enhancements

- Integration with real bus tracking APIs
- GPS location services
- Push notifications for bus arrivals
- User favorites and recent routes
- Offline mode support
- Maps integration for visual tracking

## Screenshots

The app features a modern purple gradient design with:
- Clean, intuitive interface
- Responsive design elements
- Smooth animations and transitions
- Accessibility-friendly components

---

Built with ❤️ using React Native and Expo