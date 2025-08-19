"""
Real Vadodara Address Extractor with MongoDB Storage
==================================================

This script extracts real addresses from OpenStreetMap data for Vadodara
and stores them in MongoDB database for clustering analysis.
"""

import requests
import json
import time
import random
from datetime import datetime
import logging
from typing import List, Dict, Optional
import pymongo
from pymongo import MongoClient
import pandas as pd
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class VadodaraAddressExtractor:
    """
    Extract real addresses from Vadodara using multiple data sources
    """
    
    def __init__(self, mongo_uri="mongodb://localhost:27017/", db_name="vadodara_addresses"):
        """
        Initialize the address extractor
        
        Args:
            mongo_uri: MongoDB connection string
            db_name: Database name
        """
        self.mongo_client = MongoClient(mongo_uri)
        self.db = self.mongo_client[db_name]
        self.collection = self.db.addresses
        self.geolocator = Nominatim(user_agent="vadodara_real_addresses")
        
        # Vadodara bounding box (lat_min, lon_min, lat_max, lon_max)
        self.vadodara_bounds = [22.25, 73.15, 22.35, 73.25]
        
        # Create index for better query performance
        self.collection.create_index([("location", "2dsphere")])
        self.collection.create_index("address")
        
        logger.info(f"Connected to MongoDB: {db_name}")
    
    def extract_osm_addresses(self, limit=1000) -> List[Dict]:
        """
        Extract real addresses from OpenStreetMap using Overpass API
        
        Args:
            limit: Maximum number of addresses to extract
            
        Returns:
            List of address dictionaries
        """
        logger.info("Extracting addresses from OpenStreetMap...")
        
        # Overpass API query for buildings with addresses in Vadodara
        overpass_query = f"""
        [out:json][timeout:60];
        (
          way["addr:housenumber"]["addr:street"]({self.vadodara_bounds[0]},{self.vadodara_bounds[1]},{self.vadodara_bounds[2]},{self.vadodara_bounds[3]});
          relation["addr:housenumber"]["addr:street"]({self.vadodara_bounds[0]},{self.vadodara_bounds[1]},{self.vadodara_bounds[2]},{self.vadodara_bounds[3]});
          node["addr:housenumber"]["addr:street"]({self.vadodara_bounds[0]},{self.vadodara_bounds[1]},{self.vadodara_bounds[2]},{self.vadodara_bounds[3]});
        );
        out center;
        """
        
        try:
            response = requests.post(
                "https://overpass-api.de/api/interpreter",
                data=overpass_query,
                timeout=120
            )
            response.raise_for_status()
            data = response.json()
            
            addresses = []
            for element in data.get('elements', [])[:limit]:
                if 'tags' in element and 'addr:housenumber' in element['tags']:
                    addr_info = self._parse_osm_element(element)
                    if addr_info:
                        addresses.append(addr_info)
            
            logger.info(f"Extracted {len(addresses)} addresses from OSM")
            return addresses
            
        except Exception as e:
            logger.error(f"Error extracting OSM addresses: {e}")
            return []
    
    def _parse_osm_element(self, element: Dict) -> Optional[Dict]:
        """
        Parse OSM element and extract address information
        
        Args:
            element: OSM element from Overpass API
            
        Returns:
            Parsed address dictionary or None
        """
        tags = element.get('tags', {})
        
        # Get coordinates
        if element['type'] == 'node':
            lat, lon = element['lat'], element['lon']
        elif 'center' in element:
            lat, lon = element['center']['lat'], element['center']['lon']
        else:
            return None
        
        # Build address string
        house_number = tags.get('addr:housenumber', '')
        street = tags.get('addr:street', '')
        suburb = tags.get('addr:suburb', '')
        city = tags.get('addr:city', 'Vadodara')
        state = tags.get('addr:state', 'Gujarat')
        postcode = tags.get('addr:postcode', '')
        
        # Create formatted address
        address_parts = [house_number, street, suburb, city, state]
        address_parts = [part for part in address_parts if part]
        formatted_address = ', '.join(address_parts)
        
        if postcode:
            formatted_address += f' - {postcode}'
        
        return {
            'address': formatted_address,
            'house_number': house_number,
            'street': street,
            'suburb': suburb,
            'city': city,
            'state': state,
            'postcode': postcode,
            'latitude': lat,
            'longitude': lon,
            'location': {'type': 'Point', 'coordinates': [lon, lat]},
            'source': 'openstreetmap',
            'building_type': tags.get('building', 'unknown'),
            'amenity': tags.get('amenity', ''),
            'extracted_at': datetime.utcnow()
        }
    
    def extract_places_of_interest(self, limit=500) -> List[Dict]:
        """
        Extract places of interest (shops, offices, etc.) from Vadodara
        
        Args:
            limit: Maximum number of places to extract
            
        Returns:
            List of place dictionaries
        """
        logger.info("Extracting places of interest...")
        
        # Query for various amenities and shops
        overpass_query = f"""
        [out:json][timeout:60];
        (
          node["amenity"]({self.vadodara_bounds[0]},{self.vadodara_bounds[1]},{self.vadodara_bounds[2]},{self.vadodara_bounds[3]});
          node["shop"]({self.vadodara_bounds[0]},{self.vadodara_bounds[1]},{self.vadodara_bounds[2]},{self.vadodara_bounds[3]});
          node["office"]({self.vadodara_bounds[0]},{self.vadodara_bounds[1]},{self.vadodara_bounds[2]},{self.vadodara_bounds[3]});
          way["amenity"]({self.vadodara_bounds[0]},{self.vadodara_bounds[1]},{self.vadodara_bounds[2]},{self.vadodara_bounds[3]});
          way["shop"]({self.vadodara_bounds[0]},{self.vadodara_bounds[1]},{self.vadodara_bounds[2]},{self.vadodara_bounds[3]});
        );
        out center;
        """
        
        try:
            response = requests.post(
                "https://overpass-api.de/api/interpreter",
                data=overpass_query,
                timeout=120
            )
            response.raise_for_status()
            data = response.json()
            
            places = []
            for element in data.get('elements', [])[:limit]:
                place_info = self._parse_poi_element(element)
                if place_info:
                    places.append(place_info)
            
            logger.info(f"Extracted {len(places)} places of interest")
            return places
            
        except Exception as e:
            logger.error(f"Error extracting places of interest: {e}")
            return []
    
    def _parse_poi_element(self, element: Dict) -> Optional[Dict]:
        """
        Parse POI element from OSM data
        
        Args:
            element: OSM element
            
        Returns:
            Parsed POI dictionary or None
        """
        tags = element.get('tags', {})
        
        # Get coordinates
        if element['type'] == 'node':
            lat, lon = element['lat'], element['lon']
        elif 'center' in element:
            lat, lon = element['center']['lat'], element['center']['lon']
        else:
            return None
        
        # Get name and type
        name = tags.get('name', f"Unnamed {tags.get('amenity', tags.get('shop', tags.get('office', 'place')))}")
        place_type = tags.get('amenity') or tags.get('shop') or tags.get('office') or 'unknown'
        
        # Create address
        street = tags.get('addr:street', '')
        suburb = tags.get('addr:suburb', '')
        
        address_parts = [name]
        if street:
            address_parts.append(street)
        if suburb:
            address_parts.append(suburb)
        address_parts.extend(['Vadodara', 'Gujarat'])
        
        formatted_address = ', '.join(address_parts)
        
        return {
            'address': formatted_address,
            'name': name,
            'place_type': place_type,
            'street': street,
            'suburb': suburb,
            'city': 'Vadodara',
            'state': 'Gujarat',
            'latitude': lat,
            'longitude': lon,
            'location': {'type': 'Point', 'coordinates': [lon, lat]},
            'source': 'openstreetmap_poi',
            'phone': tags.get('phone', ''),
            'website': tags.get('website', ''),
            'opening_hours': tags.get('opening_hours', ''),
            'extracted_at': datetime.utcnow()
        }
    
    def generate_residential_addresses(self, count=500) -> List[Dict]:
        """
        Generate realistic residential addresses based on known localities
        
        Args:
            count: Number of addresses to generate
            
        Returns:
            List of generated address dictionaries
        """
        logger.info(f"Generating {count} residential addresses...")
        
        # Known residential areas in Vadodara with approximate coordinates
        residential_areas = [
            {'name': 'Alkapuri', 'lat': 22.3072, 'lon': 73.1812, 'pincode': '390007'},
            {'name': 'Akota', 'lat': 22.3276, 'lon': 73.2009, 'pincode': '390020'},
            {'name': 'Fatehgunj', 'lat': 22.3193, 'lon': 73.1900, 'pincode': '390002'},
            {'name': 'Sayajigunj', 'lat': 22.3015, 'lon': 73.1896, 'pincode': '390005'},
            {'name': 'Gotri', 'lat': 22.3429, 'lon': 73.2084, 'pincode': '390021'},
            {'name': 'Manjalpur', 'lat': 22.2741, 'lon': 73.2088, 'pincode': '390011'},
            {'name': 'Harni', 'lat': 22.3158, 'lon': 73.1650, 'pincode': '390006'},
            {'name': 'Nizampura', 'lat': 22.3342, 'lon': 73.1847, 'pincode': '390002'},
            {'name': 'Subhanpura', 'lat': 22.2890, 'lon': 73.1823, 'pincode': '390023'},
            {'name': 'Sama', 'lat': 22.3547, 'lon': 73.2329, 'pincode': '390008'}
        ]
        
        # Common street names and building types
        street_types = ['Road', 'Street', 'Lane', 'Circle', 'Cross']
        society_names = ['Residency', 'Heights', 'Apartment', 'Complex', 'Society', 'Park', 'Garden']
        
        addresses = []
        per_area = count // len(residential_areas)
        
        for area in residential_areas:
            for i in range(per_area):
                # Generate realistic coordinates around the area center
                lat_offset = random.uniform(-0.01, 0.01)  # ~1km radius
                lon_offset = random.uniform(-0.01, 0.01)
                
                lat = area['lat'] + lat_offset
                lon = area['lon'] + lon_offset
                
                # Generate address components
                house_num = random.randint(1, 300)
                
                if random.random() < 0.6:  # 60% chance of society/complex
                    society = f"{random.choice(['Shree', 'Krishna', 'Radha', 'Ganga', 'Sardar', 'New'])} {random.choice(society_names)}"
                    address = f"{house_num}, {society}, {area['name']}, Vadodara, Gujarat - {area['pincode']}"
                else:
                    street = f"{area['name']} {random.choice(street_types)}"
                    address = f"{house_num}, {street}, {area['name']}, Vadodara, Gujarat - {area['pincode']}"
                
                addresses.append({
                    'address': address,
                    'house_number': str(house_num),
                    'area': area['name'],
                    'city': 'Vadodara',
                    'state': 'Gujarat',
                    'pincode': area['pincode'],
                    'latitude': lat,
                    'longitude': lon,
                    'location': {'type': 'Point', 'coordinates': [lon, lat]},
                    'source': 'generated_residential',
                    'address_type': 'residential',
                    'extracted_at': datetime.utcnow()
                })
        
        logger.info(f"Generated {len(addresses)} residential addresses")
        return addresses
    
    def store_addresses(self, addresses: List[Dict]) -> int:
        """
        Store addresses in MongoDB
        
        Args:
            addresses: List of address dictionaries
            
        Returns:
            Number of addresses inserted
        """
        if not addresses:
            return 0
        
        try:
            # Remove duplicates based on address
            unique_addresses = []
            seen_addresses = set()
            
            for addr in addresses:
                addr_key = addr['address'].lower().strip()
                if addr_key not in seen_addresses:
                    seen_addresses.add(addr_key)
                    unique_addresses.append(addr)
            
            # Insert addresses
            result = self.collection.insert_many(unique_addresses, ordered=False)
            inserted_count = len(result.inserted_ids)
            
            logger.info(f"Stored {inserted_count} unique addresses in MongoDB")
            return inserted_count
            
        except Exception as e:
            logger.error(f"Error storing addresses: {e}")
            return 0
    
    def get_database_stats(self) -> Dict:
        """
        Get statistics about stored addresses
        
        Returns:
            Dictionary with database statistics
        """
        stats = {
            'total_addresses': self.collection.count_documents({}),
            'sources': {},
            'address_types': {},
            'areas': {}
        }
        
        # Count by source
        pipeline = [{"$group": {"_id": "$source", "count": {"$sum": 1}}}]
        for result in self.collection.aggregate(pipeline):
            stats['sources'][result['_id']] = result['count']
        
        # Count by address type
        pipeline = [{"$group": {"_id": "$address_type", "count": {"$sum": 1}}}]
        for result in self.collection.aggregate(pipeline):
            if result['_id']:
                stats['address_types'][result['_id']] = result['count']
        
        # Count by area
        pipeline = [{"$group": {"_id": "$area", "count": {"$sum": 1}}}]
        for result in self.collection.aggregate(pipeline):
            if result['_id']:
                stats['areas'][result['_id']] = result['count']
        
        return stats
    
    def export_to_csv(self, filename='vadodara_addresses.csv') -> str:
        """
        Export addresses to CSV file
        
        Args:
            filename: Output CSV filename
            
        Returns:
            Path to exported file
        """
        cursor = self.collection.find({}, {
            'address': 1, 'latitude': 1, 'longitude': 1, 
            'source': 1, 'area': 1, 'pincode': 1, '_id': 0
        })
        
        df = pd.DataFrame(list(cursor))
        df.to_csv(filename, index=False)
        
        logger.info(f"Exported {len(df)} addresses to {filename}")
        return filename
    
    def close_connection(self):
        """Close MongoDB connection"""
        self.mongo_client.close()
        logger.info("MongoDB connection closed")

def main():
    """
    Main function to extract and store Vadodara addresses
    """
    print("Real Vadodara Address Extractor with MongoDB")
    print("=" * 45)
    
    # Initialize extractor
    try:
        extractor = VadodaraAddressExtractor()
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        print("Make sure MongoDB is running on localhost:27017")
        return
    
    total_extracted = 0
    
    try:
        # Clear existing data (optional)
        choice = input("Clear existing addresses? (y/n): ").lower()
        if choice == 'y':
            extractor.collection.delete_many({})
            print("Existing addresses cleared")
        
        # Extract from different sources
        print("\n1. Extracting real addresses from OpenStreetMap...")
        osm_addresses = extractor.extract_osm_addresses(limit=800)
        if osm_addresses:
            stored = extractor.store_addresses(osm_addresses)
            total_extracted += stored
            time.sleep(2)  # Rate limiting
        
        print("\n2. Extracting places of interest...")
        poi_addresses = extractor.extract_places_of_interest(limit=400)
        if poi_addresses:
            stored = extractor.store_addresses(poi_addresses)
            total_extracted += stored
            time.sleep(2)
        
        print("\n3. Generating residential addresses...")
        residential_addresses = extractor.generate_residential_addresses(count=800)
        if residential_addresses:
            stored = extractor.store_addresses(residential_addresses)
            total_extracted += stored
        
        # Show statistics
        print(f"\n📊 EXTRACTION COMPLETE!")
        print(f"Total addresses extracted: {total_extracted}")
        
        stats = extractor.get_database_stats()
        print(f"\n📈 Database Statistics:")
        print(f"Total stored addresses: {stats['total_addresses']}")
        
        if stats['sources']:
            print(f"\nBy Source:")
            for source, count in stats['sources'].items():
                print(f"  - {source}: {count}")
        
        if stats['areas']:
            print(f"\nTop Areas:")
            sorted_areas = sorted(stats['areas'].items(), key=lambda x: x[1], reverse=True)
            for area, count in sorted_areas[:10]:
                print(f"  - {area}: {count}")
        
        # Export to CSV
        csv_file = extractor.export_to_csv()
        print(f"\n💾 Addresses exported to: {csv_file}")
        
        print(f"\n🎯 Ready for clustering analysis!")
        print(f"Use the 'latitude' and 'longitude' fields for your clustering algorithms.")
        
    except KeyboardInterrupt:
        print("\n\nExtraction interrupted by user")
    except Exception as e:
        print(f"\nError during extraction: {e}")
    finally:
        extractor.close_connection()

if __name__ == "__main__":
    # Required packages
    required_packages = [
        'pymongo', 'requests', 'pandas', 'geopy'
    ]
    
    print("Required packages:")
    print("pip install pymongo requests pandas geopy")
    print()
    
    main()