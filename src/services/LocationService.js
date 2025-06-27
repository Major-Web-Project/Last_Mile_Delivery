
// Location service to handle SOS and live location sharing
class LocationServiceClass {
  constructor() {
    this.sosAlerts = [];
    this.subscribers = [];
  }

  // Send SOS alert with location
  sendSOS(locationData) {
    const sosAlert = {
      id: Date.now(),
      ...locationData,
      type: 'SOS',
      active: true
    };
    
    this.sosAlerts.push(sosAlert);
    
    // Notify all subscribers (dashboard, customer view)
    this.notifySubscribers('SOS_ALERT', sosAlert);
    
    console.log('SOS Alert sent:', sosAlert);
    
    return sosAlert;
  }

  // Subscribe to location updates
  subscribe(callback) {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // Notify all subscribers
  notifySubscribers(type, data) {
    this.subscribers.forEach(callback => {
      try {
        callback({ type, data });
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });
  }

  // Get active SOS alerts
  getActiveSOS() {
    return this.sosAlerts.filter(alert => alert.active);
  }

  // Deactivate SOS alert
  deactivateSOS(alertId) {
    const alert = this.sosAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.active = false;
      this.notifySubscribers('SOS_DEACTIVATED', alert);
    }
  }

  // Update live location
  updateLiveLocation(agentId, location) {
    const update = {
      agentId,
      ...location,
      timestamp: new Date().toISOString(),
      type: 'LOCATION_UPDATE'
    };
    
    this.notifySubscribers('LOCATION_UPDATE', update);
    return update;
  }
}

// Export singleton instance
export const LocationService = new LocationServiceClass();
