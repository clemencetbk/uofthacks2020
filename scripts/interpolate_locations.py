import sys
import json
from datetime import datetime, timedelta

def interpolate_locations(locations):
  for location in locations:
    location['date'] = datetime.strptime(location['date'], '%Y-%m-%d')
  i = 0
  while i < len(locations) - 1:
    if locations[i]['date'].strftime('%Y-%m-%d') != locations[i + 1]['date'].strftime('%Y-%m-%d'):
      locations.insert(i + 1, {
        'date': locations[i]['date'] + timedelta(days=1),
        'address': locations[i]['address'],
        'location': locations[i]['location'],
      })
    i += 1
  return list(map(lambda x: {
    'timestampMs': int(x['date'].strftime('%s')) * 1000,
    'latitudeE7': int(x['location'][0] * 10e6),
    'longitudeE7': int(x['location'][1] * 10e6),
    }, locations))

if __name__ == '__main__':
  locations = json.loads(''.join([x for x in sys.stdin]))
  print(json.dumps(interpolate_locations(locations)))