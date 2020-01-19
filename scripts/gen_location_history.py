import os
import sys
import http.client
import urllib.parse
import json

def gen_location_history(addresses):
  locations = []
  for address in addresses:
    conn = http.client.HTTPSConnection("maps.googleapis.com")
    conn.request("GET", "/maps/api/geocode/json?address=" + urllib.parse.quote_plus(address) + "&key=" + urllib.parse.quote_plus(os.environ['GOOGLE_CLOUD_API_KEY']))
    res = conn.getresponse()
    print(res.status, res.reason)
    if res.status != 200:
      raise Exception('HTTP response status', res.status)
    data = json.loads(res.read())
    if data['status'] != 'OK':
      raise Exception('HTTP response body status', body.status)
    if len(data['results']) == 0:
      raise Exception('Reverse geocoding failed for', address)
    location = data['results'][0]['geometry']['location']
    locations.append((location['lat'], location['lng']))
  return locations

if __name__ == '__main__':
  addresses = []
  for address in sys.stdin:
    addresses.append(address)
  print(gen_location_history(addresses))