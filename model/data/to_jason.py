import csv
import json

def convert_csv_to_json(input_csv_file, output_json_file):
    """
    Convert CSV file with latitude and longitude to JSON format
    
    Args:
        input_csv_file (str): Path to input CSV file
        output_json_file (str): Path to output JSON file
    """
    lat_dict = {}
    lon_dict = {}
    
    try:
        with open(input_csv_file, 'r', encoding='utf-8') as csvfile:
            # Create CSV reader
            reader = csv.DictReader(csvfile)
            
            # Process each row
            for index, row in enumerate(reader):
                # Extract latitude and longitude, converting to float
                latitude = float(row['latitude'])
                longitude = float(row['longitude'])
                
                # Add to dictionaries with index as key
                lat_dict[str(index)] = latitude
                lon_dict[str(index)] = longitude
        
        # Create the final JSON structure
        result = {
            "lat": lat_dict,
            "lon": lon_dict
        }
        
        # Write to JSON file
        with open(output_json_file, 'w', encoding='utf-8') as jsonfile:
            json.dump(result, jsonfile, separators=(',', ':'))
        
        print(f"Successfully converted {input_csv_file} to {output_json_file}")
        print(f"Processed {len(lat_dict)} records")
        
    except FileNotFoundError:
        print(f"Error: Could not find the file {input_csv_file}")
    except KeyError as e:
        print(f"Error: Missing column {e} in CSV file")
    except ValueError as e:
        print(f"Error: Invalid latitude/longitude value - {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

def main():
    # Define input and output file names
    input_file = r"c:\Users\sbari\Desktop\coding\hackathon project parul\data\vadodara_addresses.csv"  # Change this to your CSV file name
    output_file = r"c:\Users\sbari\Desktop\coding\hackathon project parul\data\destination.json"  # Change this to your desired output file name
    
    # Convert the file
    convert_csv_to_json(input_file, output_file)
    
    # Optional: Display the result
    try:
        with open(output_file, 'r') as f:
            data = json.load(f)
            print("\nGenerated JSON structure:")
            print(json.dumps(data, indent=2))
    except:
        pass

if __name__ == "__main__":
    main()